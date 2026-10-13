import React, { useRef, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import { verifyOtp, sendOtp } from "../utils/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

export default function OtpScreen({ route, navigation }) {
  const { phone } = route.params;
  const { colors } = useTheme();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputs = useRef([]);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (text, idx) => {
    const value = text.replace(/[^0-9]/g, "");
    const copy = [...otp];
    copy[idx] = value;
    setOtp(copy);
    if (value && idx < 5) inputs.current[idx + 1].focus();
    if (!value && idx > 0) inputs.current[idx - 1].focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return Alert.alert("Error", "Enter full 6-digit OTP");

    try {
      setLoading(true);
      const data = await verifyOtp(phone, code);

      if (!data?.token || !data?.user?.id) {
        throw new Error("Invalid server response");
      }
      await AsyncStorage.removeItem("is_guest");
      // Save user info in AsyncStorage
      await AsyncStorage.multiSet([
        ["token", data.token],
        ["user_id", String(data.user.id)],
        ["name", data.user.name || ""],
        ["mobile", data.user.phone || data.user.mobile || ""],  
        ["payment_status", String(data.user.payment_status || 0)],
      ]);

      if (data.user.phone) await AsyncStorage.setItem("mobile", data.user.phone);
      if (data.user.email) await AsyncStorage.setItem("email", data.user.email || "");

      // Navigate based on payment status
      // if (String(data.user.payment_status) === "1") {
      //   navigation.replace("AddBusiness");
      // } else {
      //   navigation.replace("Registration");
      // }
      navigation.replace("Main"); 

    } catch (error) {
      console.log("OTP Error:", error);
      Alert.alert("OTP Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      setResendCooldown(30);
      const data = await sendOtp(phone);
      Alert.alert("OTP Sent", "Check your mobile for the OTP.");
    } catch (err) {
      Alert.alert("Failed", err.message);
      setResendCooldown(0);
    }
  };


  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Animated.View style={{ opacity: fade, padding: 20 }}>
        <GlassCard>
          <Text style={[styles.title, { color: colors.text }]}>Verify OTP</Text>
          <Text style={[styles.sub, { color: colors.muted }]}>
            Enter the 6-digit code sent to {phone}
          </Text>

          <View style={styles.row}>
            {otp.map((d, i) => (
              <TextInput
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                value={d}
                onChangeText={(t) => handleChange(t, i)}
                style={[
                  styles.box,
                  {
                    color: colors.text,
                    backgroundColor: colors.card,
                    borderColor: colors.primary,
                  },
                ]}
                placeholder="•"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={i === 0}
              />

            ))}
          </View>

          <GradientButton
            title={loading ? "Verifying..." : "Verify & Continue"}
            onPress={handleVerify}
            loading={loading}
          />

          <TouchableOpacity onPress={handleResend} disabled={resendCooldown > 0}>
            <Text style={{ textAlign: "center", paddingTop: 10, color: colors.primary }}>
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        </GlassCard>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  sub: { marginBottom: 18 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  box: {
    width: 48,
    height: 58,
    fontSize: 22,
    textAlign: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  box: {
    width: 48,
    height: 58,
    fontSize: 22,
    textAlign: "center",
    borderWidth: 1.5,
    borderRadius: 10,
  }
});
