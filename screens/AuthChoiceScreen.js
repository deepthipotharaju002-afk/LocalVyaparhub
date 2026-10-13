import React, { useEffect, useState, useRef  } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const clearOnFirstLaunch = async () => {
  const hasLaunched = await AsyncStorage.getItem("has_launched");

  if (!hasLaunched) {
    await AsyncStorage.clear(); // 🔥 clear old cached data
    await AsyncStorage.setItem("has_launched", "true");
  }
};

const { width } = Dimensions.get("window");
const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public/api";
const redirectUri = AuthSession.makeRedirectUri({
  native: "com.localvyaparhub:/oauthredirect",
});

export default function AuthChoiceScreen({ navigation }) {
  const EXPO_CLIENT_ID =
    "780709912645-6hn009n4qni5b0uk01pm6aq8qbhma4eh.apps.googleusercontent.com";
  const IOS_CLIENT_ID = "<YOUR_IOS_CLIENT_ID>";
  const ANDROID_CLIENT_ID =
    "780709912645-pncjkdgq9nb086a7lri7h6g1ghtg8s8a.apps.googleusercontent.com";
  const WEB_CLIENT_ID =
    "780709912645-6hn009n4qni5b0uk01pm6aq8qbhma4eh.apps.googleusercontent.com";

  const [loading, setLoading] = useState(false);
  const hasNavigated = useRef(false);


  const continueAsGuest = async () => {
  await AsyncStorage.multiRemove([
    "token",
    "user_id",
    "name",
    "email",
    "mobile",
    "payment_status",
  ]);

  await AsyncStorage.setItem("is_guest", "true");
  navigation.replace("Main");
};


  // Check if user is already logged in
useEffect(() => {
  const init = async () => {
    await clearOnFirstLaunch();

    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("user_id");
    const isGuest = await AsyncStorage.getItem("is_guest");

    if (!hasNavigated.current && token && userId && isGuest !== "true") {
      hasNavigated.current = true;
      navigation.replace("Main");
    }
  };

  init();
}, []);




  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    redirectUri,
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      fetchGoogleUserInfo(response.authentication.accessToken);
    } else if (response?.type === "error") {
      Alert.alert("Google Sign-In error", "Please try again.");
    }
  }, [response]);

  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      setLoading(true);
      const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      ).then((res) => res.json());

      handleGoogleUser(userInfo);
    } catch (e) {
      setLoading(false);
      Alert.alert("Google Login Error", e.message);
    }
  };

  const handleGoogleUser = async (user) => {
    try {
      setLoading(true);

      

      const res = await fetch(`${BASE_URL}/v1/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          google_id: user.sub,
          avatar: user.picture || "",
        }),
      });

      const data = await res.json();
            setLoading(false);
      
            // if (!data.success) {
            //   Alert.alert("Login Failed", data.message || "Try again");
            //   return;
            // }

      // const raw = await res.text();
      // if (!res.ok) throw new Error("Server error");

      // const data = JSON.parse(raw);

      if (!data.success) {
        Alert.alert("Login Failed", data.message || "Try again");
        setLoading(false);
        return;
      }
      await AsyncStorage.removeItem("is_guest");

      await AsyncStorage.multiSet([
        ["token", data.token],
        ["user_id", String(data.user.id)],
        ["name", data.user.name || ""],
        ["email", data.user.email || ""],
        ["mobile", data.user.phone || data.user.mobile || ""],
        ["payment_status", String(data.user.payment_status || 0)],
      ]);

      setLoading(false);

      // Navigate based on payment
      // if (String(data.user.payment_status) === "1") {
      //   navigation.replace("AddBusiness");
      // } else {
      //   navigation.replace("Registration");
      // }
      navigation.replace("Main"); 

    } catch (e) {
      setLoading(false);
      Alert.alert("Error", e.message);
    }
  };

  const btnWidth = Math.min(width * 0.9, 420);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Local Vyapar Hub</Text>
        <Text style={styles.subtitle}>Choose a sign-in method to continue</Text>

        
        {/* Login with OTP */}
        <TouchableOpacity
          style={styles.otpBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.otpBtnText}>Login with Mobile OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.white} />
          ) : (
            <View style={styles.googleContent}>
              <MaterialCommunityIcons name="google" size={24} color="#fff" />
              <Text style={styles.googleText}>Login with Google</Text>
            </View>
          )}
        </TouchableOpacity>
        {/* Guest option */}
         <TouchableOpacity onPress={continueAsGuest}>

          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity> 
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.white },
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  logo: { width: 160, height: 120, marginBottom: 6 },
  title: { fontSize: 22, fontWeight: "700", color: theme.dark, marginTop: 6 },
  subtitle: { color: theme.muted, marginBottom: 24, textAlign: "center" },
  googleBtn: {
    width: Math.min(width * 0.9, 420),
    paddingVertical: 16,
    backgroundColor: "#4285F4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  googleContent: { flexDirection: "row", alignItems: "center" },
  googleText: { color: "#fff", fontWeight: "700", fontSize: 16, marginLeft: 8 },
   otpBtn: {
      width: Math.min(width * 0.9, 420),
      paddingVertical: 16,
      backgroundColor: theme.pink,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    otpBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    guestBtn: { marginTop: 8 },
    guestText: { color: theme.pink, fontWeight: "700" },
    
});
