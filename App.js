import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, TouchableOpacity, Linking, Animated, StyleSheet } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { getMe } from "./utils/authApi";

// Screens
import Tabs from "./navigation/Tabs";
import AuthChoiceScreen from "./screens/AuthChoiceScreen";
import LoginScreen from "./screens/LoginScreen";
import OTPVerification from "./screens/OtpScreen";

import BusinessDetails from "./screens/BusinessDetails";
import CategoryListings from "./screens/CategoryListingsScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import TermsConditionsScreen from "./screens/TermsConditionsScreen";
import AboutUsScreen from "./screens/AboutUsScreen";
import Settings from "./screens/SettingsScreen";
import ContactUsScreen from "./screens/ContactUsScreen";
import Bookmarks from "./screens/BookmarksScreen";
import AllListingsScreen from "./screens/AllListingsScreen";
import AddBusinessSetup from "./screens/AddBusinessSetupScreen";

import { ThemeProvider } from "./context/ThemeContext";





const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("AuthChoice");
  const [currentRoute, setCurrentRoute] = useState("AuthChoice");

  const navigationRef = useNavigationContainerRef();

  // Button animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const linking = {
    prefixes: ["localvyaparhub://", "https://localvyaparhub.com"],
    config: {
      screens: {
        BusinessDetails: "listing/:id",
      },
    },
  };


  // 🔍 Check login status on app start
  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");

        if (user && token) {
          setInitialRoute("Main");
        }
      } catch (err) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkUserLogin();
  }, []);

  // Floating button glow animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      if (!url) return;

      const id = url.split("/").pop();

      navigationRef.navigate("BusinessDetails", {
        business: { id }
      });
    };

    const sub = Linking.addEventListener("url", handleDeepLink);

    return () => sub.remove();
  }, []);

  useEffect(() => {
    const getInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const id = url.split("/").pop();

        navigationRef.navigate("BusinessDetails", {
          business: { id }
        });
      }
    };

    getInitialUrl();
  }, []);


  // Track visible screen
  const handleStateChange = () => {
    const route = navigationRef.getCurrentRoute();
    if (route?.name) {
      setCurrentRoute(route.name);
    }
  };

  // WhatsApp open
  const openWhatsApp = async () => {
    const businessNumber = "918978176263";
    const url = `https://wa.me/${businessNumber}?text=${encodeURIComponent(
      "Hello! I need help regarding Local Vyapar Hub."
    )}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
    else alert("WhatsApp is not installed on this device.");
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <ThemeProvider>
      <NavigationContainer ref={navigationRef} onStateChange={handleStateChange} linking={linking} >

        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          {/* 🔐 AUTH SCREENS */}
          <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTP" component={OTPVerification} />

          {/* 🏠 MAIN APP */}
          <Stack.Screen name="Main" component={Tabs} />
          <Stack.Screen name="BusinessDetails" component={BusinessDetails} />
          <Stack.Screen name="CategoryListings" component={CategoryListings} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="AboutUs" component={AboutUsScreen} />
          <Stack.Screen name="ContactUs" component={ContactUsScreen} />
          <Stack.Screen name="AllListingsScreen" component={AllListingsScreen} />
          <Stack.Screen name="Bookmarks" component={Bookmarks} />
          <Stack.Screen name="AddBusinessSetup" component={AddBusinessSetup} />
        </Stack.Navigator>

        {/* 🟢 Floating WhatsApp Button — hidden on login screens */}
        {currentRoute !== "Login" &&
          currentRoute !== "OTP" &&
          currentRoute !== "AuthChoice" && (
            <Animated.View style={[styles.floatingButton, { transform: [{ scale: scaleAnim }] }]}>
              <TouchableOpacity onPress={openWhatsApp} activeOpacity={0.8}>
                <View style={styles.whatsappIconContainer}>
                  <Ionicons name="logo-whatsapp" size={28} color="#fff" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  floatingButton: { position: "absolute", bottom: 75, right: 15, zIndex: 100 },
  whatsappIconContainer: {
    backgroundColor: "#25D366",
    borderRadius: 35,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
