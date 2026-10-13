import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import ListingSkeleton from "./ListingSkeleton";
import { hp, wp, rf } from "../utils/responsive";

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public";

export default function AllListings({ data = [], loading = false }) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  if (loading) {
    return <ListingSkeleton count={3} />;
  }

  if (!data.length) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ textAlign: "center", color: colors.text }}>
          No listings found.
        </Text>
      </View>
    );
  }

  function getLocationName(item) {
    if (item.village?.name) return item.village.name;
    if (item.village_name) return item.village_name;
    if (typeof item.village === "string") return item.village;
    if (item.mandal?.name) return item.mandal.name;
    if (item.district?.name) return item.district.name;
    if (item.location) return item.location;
    return "Unknown";
  }

  function handleCall(item) {
    const phone = item.phone || item.mobile || item.contact_number;
    if (phone) Linking.openURL(`tel:${phone}`);
    else Alert.alert("No contact number available");
  }

  function handleDirections(item) {
    const lat = item.village?.latitude;
    const lng = item.village?.longitude;

    if (lat && lng) {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      );
    } else {
      Alert.alert("Location not available");
    }
  }

  function renderItem({ item }) {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    let hours = "Open hours not available";

    if (item.opening_hours && typeof item.opening_hours === "object") {
      const todayHours = item.opening_hours[today];
      if (todayHours?.open && todayHours?.close) {
        hours = `${todayHours.open} - ${todayHours.close}`;
      } else if (typeof todayHours === "string") {
        hours = todayHours;
      } else {
        hours = "Closed";
      }
    }

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("BusinessDetails", { business: item })
        }
      >
        {item.thumbnail ? (
          <Image
            source={{ uri: `${BASE_URL}/${item.thumbnail}` }}
            style={styles.cardImage}
          />
        ) : (
          <View style={[styles.cardImage, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>
              {item.business_name || "Unnamed"}
            </Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
            {item.business_name}
          </Text>

          <Text style={[styles.cardSubtitle, { color: colors.text }]} numberOfLines={1}>
            {item.category?.name || item.category_name || "General"}
          </Text>

          <Text style={[styles.cardCity, { color: colors.text }]} numberOfLines={1}>
            {getLocationName(item)}
          </Text>

          <Text style={[styles.openLabel, { color: colors.secondary }]}>
            {today}: {hours}
          </Text>

          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => handleCall(item)}>
              <Text style={[styles.actionText, { color: colors.primary }]}>
                📞 Call Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDirections(item)}>
              <Text style={[styles.actionText, { color: colors.primary }]}>
                📍 Directions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: wp(2) }}
    />
  );
}
const styles = StyleSheet.create({
  card: {
    width: wp(60),
    borderRadius: 12,
    marginRight: wp(3),
    overflow: "hidden",
    elevation: 2,
  },

  cardImage: {
    height: hp(18),
    width: "100%",
    resizeMode: "cover",
  },

  imagePlaceholder: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#777",
    textAlign: "center",
    paddingHorizontal: 8,
  },

  cardContent: {
    padding: wp(3),
  },

  cardTitle: {
    fontSize: rf(15),
    fontWeight: "700",
  },

  cardSubtitle: {
    fontSize: rf(12),
    marginTop: 2,
  },

  cardCity: {
    fontSize: rf(11),
    marginTop: 2,
  },

  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1),
  },

  actionText: {
    fontSize: rf(11),
    fontWeight: "600",
  },
});