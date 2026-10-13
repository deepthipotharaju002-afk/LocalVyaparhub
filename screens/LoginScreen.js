// screens/LoginScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import GoogleButton from "../components/GoogleButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useTheme } from "../context/ThemeContext";
import { sendOtp } from "../utils/authApi";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start();
  }, []);

  // GOOGLE LOGIN SETUP
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "780709912645-6hn009n4qni5b0uk01pm6aq8qbhma4eh.apps.googleusercontent.com",
    androidClientId: "780709912645-pncjkdgq9nb086a7lri7h6g1ghtg8s8a.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    webClientId: "780709912645-6hn009n4qni5b0uk01pm6aq8qbhma4eh.apps.googleusercontent.com",
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      fetchGoogleUserInfo(response.authentication.accessToken);
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

      console.log("Google User:", userInfo);

      handleGoogleUser(userInfo);
    } catch (e) {
      setLoading(false);
      Alert.alert("Google Login Error", e.message);
    }
  };

  const handleGoogleUser = async (user) => {
    try {
      setLoading(true);

      const res = await fetch("https://your-backend.com/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          avatar: user.picture,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!data.success) {
        Alert.alert("Login Failed", data.message || "Try again");
        return;
      }

      // store locally
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      navigation.replace("Main");
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", e.message);
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 6) {
      Alert.alert("Invalid phone", "Please enter a valid phone number");
      return;
    }
    try {
      setLoading(true);
      const res = await sendOtp(phone);
      setLoading(false);
      navigation.navigate("OTP", { phone });
    } catch (e) {
      setLoading(false);
      Alert.alert("Send OTP Failed", e.message || "Try again");
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.brandWrap,
            {
              opacity: cardAnim,
              transform: [
                {
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={[styles.hi, { color: colors.text }]}>
            Welcome to Local Vyapar Hub
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: cardAnim }}>
          <GlassCard style={{ marginHorizontal: 20 }}>
            <Text style={[styles.label, { color: colors.muted }]}>Phone</Text>
            <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.primary,
                  },
                ]}
              >

              <Text style={[styles.cc, { color: colors.text }]}>+91</Text>
              
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                  },
                ]}
                keyboardType="number-pad"
                placeholder="Enter phone number"
                placeholderTextColor={colors.muted}
                selectionColor={colors.primary}
                value={phone}
                onChangeText={(text) => {
                  // allow only digits
                  const numeric = text.replace(/[^0-9]/g, "");

                  // limit to 10 digits
                  if (numeric.length <= 10) {
                    setPhone(numeric);
                  }
                }}
                maxLength={10}
              />

            </View>

            <GradientButton
              title={loading ? "Please wait..." : "Send OTP"}
              onPress={handleSendOtp}
              disabled={loading}
              style={{ marginTop: 14 }}
            />

            {/* <Text style={[styles.or, { color: colors.muted }]}>or</Text> */}

            {loading && (
              <ActivityIndicator size="small" color={colors.text} />
            )}

            {/* <GoogleButton
              onPress={() => promptAsync({ useProxy: true })}
              disabled={!request || loading}
            /> */}
          </GlassCard>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: "center" },
  brandWrap: { alignItems: "center", marginBottom: 18 },
  logo: { width: 120, height: 90, resizeMode: "contain" },
  hi: { fontSize: 18, fontWeight: "700", marginTop: 8 },
  label: { fontSize: 13, marginBottom: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  cc: { fontSize: 16, marginRight: 10, fontWeight: "700" },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  or: { textAlign: "center", marginVertical: 12, fontWeight: "600" },
});