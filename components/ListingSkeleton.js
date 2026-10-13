import React from "react";
import { View, StyleSheet } from "react-native";
import { wp, hp } from "../utils/responsive";

export default function ListingSkeleton({ count = 3 }) {
  return (
    <View style={{ flexDirection: "row", paddingHorizontal: wp(2) }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.image} />
          <View style={styles.line} />
          <View style={[styles.line, { width: "60%" }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: wp(60),
    borderRadius: 12,
    marginRight: wp(3),
    backgroundColor: "#eee",
    padding: 8,
  },
  image: {
    height: hp(16),
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  line: {
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 6,
    marginTop: 8,
  },
});
