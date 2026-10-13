import React, { memo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { hp, wp } from "../utils/responsive";

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public";

function BusinessCard({ item }) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() =>
        navigation.navigate("BusinessDetails", { business: item })
      }
    >
      <Image
        source={{
          uri: item.thumbnail
            ? `${BASE_URL}/${item.thumbnail}`
            : undefined,
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {item.business_name}
        </Text>
        <Text style={[styles.sub, { color: colors.text }]} numberOfLines={1}>
          {item.category?.name || "General"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(BusinessCard);

const styles = StyleSheet.create({
  card: {
    width: wp(60),
    borderRadius: 12,
    marginRight: wp(3),
    overflow: "hidden",
  },
  image: { width: "100%", height: hp(18) },
  content: { padding: wp(3) },
  title: { fontWeight: "bold" },
  sub: { fontSize: 12 },
});
