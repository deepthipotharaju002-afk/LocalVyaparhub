// components/GradientButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

export default function GradientButton({ title, onPress, disabled, loading, style }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} disabled={disabled || loading} style={style}>
      <LinearGradient
        colors={[colors.primary, colors.accent || "#9b59b6"]}
        start={[0, 0]}
        end={[1, 1]}
        style={[styles.btn, disabled && { opacity: 0.7 }]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  text: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
