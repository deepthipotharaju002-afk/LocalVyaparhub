import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import Header from "../screens/Header";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

// 🔑 PUT YOUR API KEY HERE
const GOOGLE_MAPS_API_KEY = "AIzaSyDBX_Ltqw9mlPrcmMUkZwymlYhRZvzbHhw";

const ContactUsScreen = ({ navigation }) => {
  const { colors } = useTheme();

  // 📍 Local Vyapar Hub – Mangalagiri
  const latitude = 16.4348179;
  const longitude = 80.5674503;

  // 👉 Open Google Maps App
  const openGoogleMaps = () => {
    const url = Platform.select({
      android: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };

  // 🗺 STATIC MAP (VISIBLE — NOT WHITE)
  const staticMapUrl =
    `https://maps.googleapis.com/maps/api/staticmap` +
    `?center=${latitude},${longitude}` +
    `&zoom=16` +
    `&size=600x300` +
    `&scale=2` +
    `&markers=color:red|label:L|${latitude},${longitude}` +
    `&key=${GOOGLE_MAPS_API_KEY}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Contact Us" navigation={navigation} showBack />

      {/* 🗺 MAP PREVIEW */}
      <TouchableOpacity activeOpacity={0.9} onPress={openGoogleMaps}>
        <Image
          source={{ uri: staticMapUrl }}
          style={styles.map}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Get in touch with us
        </Text>

        {/* 📍 Address */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            7-66, Gowthambudda Road, near Bismillah Dum Biryani Center,
            Mangalagiri, Andhra Pradesh 522503, India
          </Text>
        </View>

        {/* 📞 Phone */}
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={18} color={colors.primary} />
          <Text
            style={[styles.infoText, { color: colors.text }]}
            onPress={() => Linking.openURL("tel:+918978176263")}
          >
            +91 89781 76263
          </Text>
        </View>

        {/* ✉️ Email */}
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color={colors.primary} />
          <Text
            style={[styles.infoText, { color: colors.text }]}
            onPress={() =>
              Linking.openURL("mailto:contact@localvyaparhub.com")
            }
          >
            contact@localvyaparhub.com
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  map: {
    width,
    height: 220,
    backgroundColor: "#e5e5e5",
  },
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
});
