// components/GoogleButton.js
import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import GlassCard from "./GlassCard";

export default function GoogleButton({ onPress, disabled }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}>
      <GlassCard style={styles.card}>
        <View style={styles.row}>
          <Image source={require("../assets/images/google.png")} style={styles.logo} />
          <Text style={styles.text}>Continue with Google</Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { paddingHorizontal: 12, paddingVertical: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  logo: { width: 28, height: 28, marginRight: 12 },
  text: { fontWeight: "700", color: "#111" },
});
