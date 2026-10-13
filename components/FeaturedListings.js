import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { hp, wp, rf } from "../utils/responsive";

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public";

export default function FeaturedListings({
  data = [],
  loading = false,
}) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  // ---------------- HELPERS ----------------
  function handleCall(item) {
    const phone = item.phone || item.mobile || item.contact_number;
    if (!phone) {
      Alert.alert("No phone number available");
      return;
    }
    Linking.openURL(`tel:${phone}`);
  }

  function handleDirections(item) {
    const lat = item.latitude || item.village?.latitude;
    const lng = item.longitude || item.village?.longitude;

    const address = [
      item.business_name,
      item.address_line1,
      item.village?.name,
      item.mandal?.name,
      item.district?.name,
    ]
      .filter(Boolean)
      .join(", ");

    let url;
    if (lat && lng) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    } else if (address) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`;
    } else {
      Alert.alert("Location not available");
      return;
    }

    Linking.openURL(url);
  }

  function getTodayHours(item) {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    if (!item.opening_hours || typeof item.opening_hours !== "object") {
      return "Hours not specified";
    }

    const todayHours = item.opening_hours[today];
    if (!todayHours) return "Closed";

    if (typeof todayHours === "string") return todayHours;
    return `${todayHours.open || "??"} - ${todayHours.close || "??"}`;
  }

  // ---------------- CARD ----------------
  function renderItem({ item }) {
    const hours = getTodayHours(item);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.card, { backgroundColor: colors.card }]}
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
          <View style={styles.row}>
            <Text
              style={[styles.cardTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.business_name}
            </Text>
            {item.verified && <Text style={styles.verified}>✔️</Text>}
          </View>

          <Text
            style={[styles.cardSubtitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.category?.name || item.category_name || "General"}
          </Text>

          <Text
            style={[styles.cardCity, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.village?.name ||
              item.mandal?.name ||
              item.district?.name ||
              "Unknown"}
          </Text>

          <Text style={[styles.openLabel, { color: colors.secondary }]}>
            Today: {hours}
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

  // ---------------- RENDER ----------------
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Featured Listings
      </Text>

      {loading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : data.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No featured listings found.
        </Text>
      ) : (
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: wp(2) }}
        />
      )}
    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: {
    marginTop: hp(3),
    paddingHorizontal: wp(2),
  },

  title: {
    fontSize: rf(18),
    fontWeight: "700",
    marginBottom: hp(1),
    marginLeft: wp(2),
  },

  card: {
    width: wp(60),
    borderRadius: 14,
    marginRight: wp(3),
    overflow: "hidden",
    elevation: 3,
  },

  cardImage: {
    width: "100%",
    height: hp(18),
    resizeMode: "cover",
  },

  imagePlaceholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#777",
    textAlign: "center",
    paddingHorizontal: 10,
  },

  cardContent: {
    padding: wp(3),
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: rf(15),
    fontWeight: "700",
    flex: 1,
  },

  verified: {
    marginLeft: 6,
    fontSize: rf(13),
  },

  cardSubtitle: {
    fontSize: rf(13),
    marginTop: 2,
  },

  cardCity: {
    fontSize: rf(12),
    marginTop: 2,
  },

  openLabel: {
    fontSize: rf(12),
    marginTop: 4,
  },

  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1),
  },

  actionText: {
    fontSize: rf(12),
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: hp(3),
  },
});
