// components/GlassCard.js
import React from "react";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export default function GlassCard({ children, style }) {
  return (
    <BlurView intensity={65} tint="light" style={[styles.card, style]}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 15,
    marginVertical: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)", // glass border
  },
});
