import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Header from "../screens/Header";
import { useTheme } from "../context/ThemeContext";
import {
  saveListing,
  getCountries,
  getStates,
  getDistricts,
  getMandals,
  getVillages,
  getCategories,
} from "../utils/api";
import { hp, wp, rf } from "../utils/responsive";

/* ---------------- DAYS (BACKEND FORMAT) ---------------- */
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AddBusinessScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  const [loading, setLoading] = useState(false);

  /* ---------- BASIC ---------- */
  const [businessName, setBusinessName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [avgPrice, setAvgPrice] = useState("");

  /* ---------- CONTACT ---------- */
  const [phone, setPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  /* ---------- ADDRESS ---------- */
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pinCode, setPinCode] = useState("");

  /* ---------- LOCATION IDS ---------- */
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [mandalId, setMandalId] = useState("");
  const [villageId, setVillageId] = useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ---------- MEDIA ---------- */
  const [thumbnail, setThumbnail] = useState(null);
  const [promos, setPromos] = useState([]);

  /* ---------- MAP ---------- */
  const [location, setLocation] = useState(null);

  /* ---------- FLAGS ---------- */
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [verified, setVerified] = useState(false);

  /* ---------- OPENING HOURS (CORRECT FORMAT) ---------- */
  const [openingHours, setOpeningHours] = useState(
    DAYS.reduce((acc, d) => {
      acc[d] = { open: "", close: "", closed: false };
      return acc;
    }, {})
  );

  /* ---------- LOAD DROPDOWNS ---------- */
  useEffect(() => {
    getCountries().then(setCountries);
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (countryId) getStates(countryId).then(setStates);
  }, [countryId]);

  useEffect(() => {
    if (stateId) getDistricts(stateId).then(setDistricts);
  }, [stateId]);

  useEffect(() => {
    if (districtId) getMandals(districtId).then(setMandals);
  }, [districtId]);

  useEffect(() => {
    if (mandalId) getVillages(mandalId).then(setVillages);
  }, [mandalId]);

  /* ---------- IMAGE PICKERS ---------- */
  const pickThumbnail = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled) setThumbnail(res.assets[0].uri);
  };

  const pickPromos = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!res.canceled) setPromos(res.assets.map((a) => a.uri));
  };

  /* ---------- LOCATION ---------- */
  const pickCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
    if (!businessName || !categoryId) {
      Alert.alert("Validation", "Business name & category required");
      return;
    }

    if (promos.length < 3) {
      Alert.alert("Validation", "Minimum 3 promo images required");
      return;
    }

    const userId = await AsyncStorage.getItem("user_id");

    const form = new FormData();
    form.append("business_name", businessName);
    form.append("category_id", categoryId);
    form.append("user_id", userId);

    form.append("description", description);
    form.append("tags", tags);
    form.append("avg_price", avgPrice);

    form.append("address_line1", address1);
    form.append("address_line2", address2);
    form.append("landmark", landmark);
    form.append("pin_code", pinCode);

    form.append("phone", phone);
    form.append("secondary_phone", secondaryPhone);
    form.append("whatsapp_number", whatsapp);
    form.append("email", email);
    form.append("website", website);

    form.append("country_id", countryId);
    form.append("state_id", stateId);
    form.append("district_id", districtId);
    form.append("mandal_id", mandalId);
    form.append("village_id", villageId);

    form.append("is_active", isActive ? 1 : 0);
    form.append("is_featured", isFeatured ? 1 : 0);
    form.append("verified", verified ? 1 : 0);

    form.append("opening_hours", JSON.stringify(openingHours));

    if (location) {
      form.append("latitude", location.latitude);
      form.append("longitude", location.longitude);
    }

    if (thumbnail) {
      form.append("thumbnail", {
        uri: thumbnail,
        name: "thumbnail.jpg",
        type: "image/jpeg",
      });
    }

    promos.forEach((uri, i) => {
      form.append("promos[]", {
        uri,
        name: `promo_${i}.jpg`,
        type: "image/jpeg",
      });
    });

    try {
      setLoading(true);
      await saveListing(form);
      Alert.alert("Success", "Business added");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Failed to save business");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Add Business" navigation={navigation} showBack />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.section, { color: colors.text }]}>Basic Info</Text>
        <Input label="Business Name" value={businessName} setValue={setBusinessName} colors={colors} />
        <Input label="Description" value={description} setValue={setDescription} colors={colors} multiline />
        <Input label="Tags (comma separated)" value={tags} setValue={setTags} colors={colors} />
        <Input label="Average Price" value={avgPrice} setValue={setAvgPrice} colors={colors} />

        <Text style={[styles.section, { color: colors.text }]}>Images</Text>
        <Button text="Pick Thumbnail" onPress={pickThumbnail} />
        {thumbnail && <Image source={{ uri: thumbnail }} style={styles.preview} />}
        <Button text="Pick Promo Images (min 3)" onPress={pickPromos} />

        <Text style={[styles.section, { color: colors.text }]}>Opening Hours</Text>
        {DAYS.map((d) => (
          <View key={d} style={styles.row}>
            <Text style={{ color: colors.text, width: wp(25) }}>{d}</Text>
            <TextInput
              placeholder="Open"
              value={openingHours[d].open}
              onChangeText={(v) =>
                setOpeningHours({ ...openingHours, [d]: { ...openingHours[d], open: v } })
              }
              style={[styles.timeInput, { color: colors.text }]}
            />
            <TextInput
              placeholder="Close"
              value={openingHours[d].close}
              onChangeText={(v) =>
                setOpeningHours({ ...openingHours, [d]: { ...openingHours[d], close: v } })
              }
              style={[styles.timeInput, { color: colors.text }]}
            />
            <Switch
              value={openingHours[d].closed}
              onValueChange={(v) =>
                setOpeningHours({ ...openingHours, [d]: { ...openingHours[d], closed: v } })
              }
            />
          </View>
        ))}

        <Text style={[styles.section, { color: colors.text }]}>Location</Text>
        <Button text="Use Current Location" onPress={pickCurrentLocation} />
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

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Business</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

const Input = ({ label, value, setValue, colors, multiline }) => (
  <>
    <Text style={{ color: colors.text, marginTop: hp(1) }}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={setValue}
      multiline={multiline}
      style={[styles.input, { color: colors.text, borderColor: colors.border }]}
    />
  </>
);

const Button = ({ text, onPress }) => (
  <TouchableOpacity style={styles.btn} onPress={onPress}>
    <Text style={styles.btnText}>{text}</Text>
  </TouchableOpacity>
);

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { padding: wp(4), paddingBottom: hp(5) },
  section: { fontSize: rf(16), fontWeight: "700", marginTop: hp(3) },
  input: { borderWidth: 1, borderRadius: wp(2), padding: hp(1.2) },
  btn: { marginTop: hp(1.5), backgroundColor: "#000", padding: hp(1.2), borderRadius: wp(2), alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "600" },
  preview: { height: hp(18), marginTop: hp(1), borderRadius: wp(2) },
  row: { flexDirection: "row", alignItems: "center", marginTop: hp(1) },
  timeInput: { borderWidth: 1, borderRadius: wp(2), padding: hp(0.8), marginHorizontal: wp(1), width: wp(18) },
  map: { height: hp(25), marginTop: hp(2), borderRadius: wp(2) },
  saveBtn: { marginTop: hp(4), backgroundColor: "#000", padding: hp(1.6), borderRadius: wp(2), alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700" },
});
