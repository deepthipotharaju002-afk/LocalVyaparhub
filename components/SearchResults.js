import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import BusinessCard from "./BusinessCard";
import { hp, wp, rf } from "../utils/responsive";

export default function SearchResults({ data = [] }) {
  const { colors } = useTheme();

  // ❌ Do not render if nothing to show
  if (!Array.isArray(data)) return null;

  // 😕 No results found
  if (data.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No data found
        </Text>
      </View>
    );
  }

  // ✅ Results
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Search Results
      </Text>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => <BusinessCard item={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: wp(2) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
  },
  title: {
    fontSize: rf(16),
    fontWeight: "700",
    marginHorizontal: wp(3),
    marginBottom: hp(1),
  },
  emptyBox: {
    marginTop: hp(4),
    alignItems: "center",
  },
  emptyText: {
    fontSize: rf(14),
    fontWeight: "600",
  },
});
