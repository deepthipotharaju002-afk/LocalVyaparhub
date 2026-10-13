import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "../utils/responsive";
import * as Location from "expo-location";

export default function Header({
  navigation,
  showBack = false,
  showSettings = false,
}) {
  const { isDark, colors } = useTheme();
  const [location, setLocation] = useState("Fetching location...");

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocation("Location denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (address.length > 0) {
        const place = address[0];
        const city =
          place.city ||
          place.subregion ||
          place.district ||
          "";
        const state = place.region || "";

        setLocation(`${city}${state ? ", " + state : ""}`);
      }
    } catch (error) {
      console.log("Location error:", error);
      setLocation("Unable to fetch location");
    }
  };

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: isDark ? colors.card : "#F8F8F8" },
      ]}
    >
      {/* 🔙 Back Button */}
      {showBack && (
        <TouchableOpacity
          style={styles.iconLeft}
          onPress={() => navigation?.goBack?.()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
      )}

      {/* ⚙️ Settings Button */}
      {showSettings && (
        <TouchableOpacity
          style={styles.iconRight}
          onPress={() => navigation?.navigate?.("Settings")}
        >
          <Ionicons name="settings-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      )}

      {/* 🔹 Centered Logo and Location */}
      <View style={styles.centerContent}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={18} color={colors.primary} />
          <Text
            style={[styles.locationText, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {location}
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop:
      Platform.OS === "android" ? verticalScale(35) : verticalScale(15),
    paddingBottom: verticalScale(10),
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },

  // ✅ Center content (Logo + Location below)
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: scale(100),
    height: verticalScale(40),
    marginBottom: verticalScale(5),
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "80%",
  },
  locationText: {
    fontSize: moderateScale(14),
    marginLeft: scale(4),
    fontWeight: "600",
    textAlign: "center",
  },

  // 🔙 Back & ⚙️ Settings buttons
  iconLeft: {
    position: "absolute",
    left: scale(15),
    top: Platform.OS === "android" ? verticalScale(40) : verticalScale(20),
  },
  iconRight: {
    position: "absolute",
    right: scale(15),
    top: Platform.OS === "android" ? verticalScale(40) : verticalScale(20),
  },
});