// screens/RegistrationScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import Header from "../screens/Header";

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [isMobileDisabled, setIsMobileDisabled] = useState(false);
  const [loading, setLoading] = useState(false);


  // ✅ Load ALL saved user data (INCLUDING NAME)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem("name");
        const storedEmail = await AsyncStorage.getItem("email");
        const storedMobile = await AsyncStorage.getItem("mobile");

        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (storedMobile) {
          setMobile(storedMobile);
          setIsMobileDisabled(true);
        }
      } catch (err) {
        console.log("Error reading AsyncStorage:", err);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const checkGuest = async () => {
      const isGuest = await AsyncStorage.getItem("is_guest");

      if (isGuest === "true") {
        setName("");
        setEmail("");
        setMobile("");
      }
    };

    checkGuest();
  }, []);


  // ✅ Validation
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!name.trim()) {
      Alert.alert("Error", "Enter full name");
      return false;
    }

    if (email && !emailRegex.test(email)) {
      Alert.alert("Error", "Invalid email");
      return false;
    }

    if (!phoneRegex.test(mobile)) {
      Alert.alert("Error", "Invalid mobile number");
      return false;
    }

    return true;
  };

  // ✅ Save profile
  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        setLoading(false);
        return;
      }

      const URL =
        "https://localvyaparhub.com/LocalVyaparHub/public/api/v1/auth/save-profile";

      const res = await fetch(URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, mobile }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Save locally
        await AsyncStorage.multiSet([
          ["name", name],
          ["email", email || ""],
          ["mobile", mobile],
          ["payment_status", "0"], // ✅ ENSURE IT EXISTS
        ]);

        //Alert.alert("Success", "Profile saved successfully");
        navigation.replace("PaymentPreview");
      } else {
        Alert.alert("Error", data.message || "Failed to save profile");
      }
    } catch (e) {
      console.log("Network error:", e);
      Alert.alert("Error", "Network issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header navigation={navigation} showBack />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          User Registration
        </Text>

        {/* FULL NAME */}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: isDark ? "#444" : "#ccc",
              backgroundColor: colors.card,
            },
          ]}
          placeholder="Full Name"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
        />

        {/* EMAIL */}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: isDark ? "#444" : "#ccc",
              backgroundColor: colors.card,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* MOBILE */}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: isDark ? "#444" : "#ccc",
              backgroundColor: colors.card,
            },
          ]}
          placeholder="Mobile"
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
          maxLength={10}
          value={mobile}
          editable={!isMobileDisabled}
          onChangeText={setMobile}
        />

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {loading ? "Saving..." : "Continue to Payment"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 15,
  },
  submitBtn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
