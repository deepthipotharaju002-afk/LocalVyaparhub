import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../screens/Header";
import { useTheme } from "../context/ThemeContext";
import { saveListing } from "../utils/api";
import { hp, wp, rf } from "../utils/responsive";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// 30-minute time slots in 24-hour format
const TIME_SLOTS = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${min}`;
});

export default function AddBusinessSetupScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { payload } = route.params;

  const [loading, setLoading] = useState(false);

  // OPENING HOURS state
  const [openingHours, setOpeningHours] = useState(
    DAYS.reduce((acc, d) => {
      acc[d] = { openTime: "08:00", closeTime: "21:00", closed: false };
      return acc;
    }, {})
  );

  // LOCATION state
  const [location, setLocation] = useState(
    payload?.latitude && payload?.longitude
      ? { latitude: Number(payload.latitude), longitude: Number(payload.longitude) }
      : null
  );

  // FLAGS
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [verified, setVerified] = useState(false);

  // Auto fetch lat/lng from address
  const fetchLatLng = async () => {
    if (!payload) return;

    const fullAddress = `${payload.address1 || ""} ${payload.address2 || ""} ${payload.landmark || ""} ${payload.villageName || ""} ${payload.mandalName || ""} ${payload.districtName || ""}`;
    const key = "YOUR_GOOGLE_MAPS_API_KEY"; // <-- Replace with your API key

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          fullAddress
        )}&key=${key}`
      );
      const data = await res.json();
      if (data.results && data.results.length) {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ latitude: lat, longitude: lng });
      }
    } catch (e) {
      console.log("Geocode error:", e.message || e);
    }
  };

  useEffect(() => {
    fetchLatLng();
  }, []);

  // SAVE handler
  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) {
        Alert.alert("Login Required", "User not logged in");
        return;
      }

      const form = new FormData();

      // IMAGES
      if (payload.thumbnail) {
        form.append("thumbnail", {
          uri: payload.thumbnail,
          name: "thumbnail.jpg",
          type: "image/jpeg",
        });
      }
      if (Array.isArray(payload.promos)) {
        payload.promos.forEach((uri, i) => {
          form.append("promos[]", { uri, name: `promo_${i}.jpg`, type: "image/jpeg" });
        });
      }

      // BASIC INFO
      form.append("user_id", userId);
      form.append("business_name", payload.businessName || "");
      form.append("category_id", payload.categoryId || "");
      form.append("description", payload.description || "");
      form.append("tags", payload.tags || "");
      form.append("avg_price", payload.avgPrice || "");

      // CONTACT
      form.append("phone", payload.phone || "");
      form.append("secondary_phone", payload.secondaryPhone || "");
      form.append("whatsapp_number", payload.whatsapp || "");
      form.append("email", payload.email || "");
      form.append("website", payload.website || "");

      // ADDRESS
      form.append("address_line1", payload.address1 || "");
      form.append("address_line2", payload.address2 || "");
      form.append("landmark", payload.landmark || "");
      form.append("pin_code", payload.pinCode || "");
      form.append("country_id", payload.countryId || "");
      form.append("state_id", payload.stateId || "");
      form.append("district_id", payload.districtId || "");
      form.append("mandal_id", payload.mandalId || "");
      form.append("village_id", payload.villageId || "");

      // OPENING HOURS
      const normalizedHours = {};
      Object.keys(openingHours).forEach((day) => {
        const d = openingHours[day];
        normalizedHours[day.toLowerCase()] = d.closed
          ? { closed: true }
          : { open: d.openTime, close: d.closeTime, closed: false };
      });
      form.append("opening_hours", JSON.stringify(normalizedHours));

      // FLAGS
      form.append("is_active", "0");
        form.append("is_featured", "0");
        form.append("verified", "0");


      // LOCATION
      if (location) {
        form.append("latitude", String(location.latitude));
        form.append("longitude", String(location.longitude));
      }

      setLoading(true);
      await saveListing(form);

      Alert.alert("Success", "Business added successfully");
      //navigation.popToTop();
      navigation.replace("Main");
    } catch (e) {
      console.log("SAVE ERROR:", e.message || e);
      Alert.alert("Error", e.message || "Failed to save business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Business Setup" navigation={navigation} showBack />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.section, { color: colors.text }]}>Opening Hours</Text>
        {DAYS.map((day) => {
          const d = openingHours[day];
          return (
            <View key={day} style={styles.dayBlock}>
              <Text style={[styles.dayText, { color: colors.text }]}>{day}</Text>
              <View style={styles.timeRow}>
                <Picker
                  enabled={!d.closed}
                  selectedValue={d.openTime}
                  style={styles.picker}
                  onValueChange={(v) =>
                    setOpeningHours((p) => ({ ...p, [day]: { ...p[day], openTime: v } }))
                  }
                >
                  {TIME_SLOTS.map((t) => (
                    <Picker.Item key={t} label={t} value={t} />
                  ))}
                </Picker>
                <Text style={{ marginHorizontal: 5 }}>to</Text>
                <Picker
                  enabled={!d.closed}
                  selectedValue={d.closeTime}
                  style={styles.picker}
                  onValueChange={(v) =>
                    setOpeningHours((p) => ({ ...p, [day]: { ...p[day], closeTime: v } }))
                  }
                >
                  {TIME_SLOTS.map((t) => (
                    <Picker.Item key={t} label={t} value={t} />
                  ))}
                </Picker>
              </View>
              <View style={styles.closedRow}>
                <Text style={{ color: colors.text }}>Closed</Text>
                <Switch
                  value={d.closed}
                  onValueChange={(v) =>
                    setOpeningHours((p) => ({
                      ...p,
                      [day]: { ...p[day], closed: v },
                    }))
                  }
                />
              </View>
            </View>
          );
        })}

        <Text style={[styles.section, { color: colors.text }]}>Location</Text>
        {location && (
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={location} />
          </MapView>
        )}

        {/* <Text style={[styles.section, { color: colors.text }]}>Status</Text>
        <Flag label="Active" value={isActive} setValue={setIsActive} />
        <Flag label="Featured" value={isFeatured} setValue={setIsFeatured} />
        <Flag label="Verified" value={verified} setValue={setVerified} /> */}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Business</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------------- COMPONENTS ---------------- */
const Flag = ({ label, value, setValue }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.flagRow}>
      <Text style={{ color: colors.text }}>{label}</Text>
      <Switch value={value} onValueChange={setValue} />
    </View>
  );
};

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { padding: wp(4), paddingBottom: hp(5) },
  section: { fontSize: rf(16), fontWeight: "700", marginTop: hp(3) },
  dayBlock: { padding: hp(1), borderRadius: wp(2), marginTop: hp(1) },
  dayText: { fontWeight: "600", marginBottom: hp(0.5) },
  timeRow: { flexDirection: "row", alignItems: "center", marginBottom: hp(1) },
  picker: { flex: 1, height: 40 },
  closedRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: hp(1) },
  map: { height: hp(25), borderRadius: wp(2), marginTop: hp(2) },
  flagRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: hp(1.5) },
  saveBtn: { marginTop: hp(4), backgroundColor: "#ED208E", padding: hp(1.6), borderRadius: wp(3), alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700", fontSize: rf(15) },
});
