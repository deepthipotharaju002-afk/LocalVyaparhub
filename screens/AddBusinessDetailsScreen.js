import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";

import Header from "../screens/Header";
import { useTheme } from "../context/ThemeContext";
import {
  getCountries,
  getStates,
  getDistricts,
  getCategories,
} from "../utils/api";
import { hp, wp, rf } from "../utils/responsive";

export default function AddBusinessDetailsScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const richRef = useRef(null);

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

  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [mandal, setMandal] = useState("");
  const [village, setVillage] = useState("");

  /* ---------- MEDIA ---------- */
  const [thumbnail, setThumbnail] = useState(null);
  const [promos, setPromos] = useState([]);

  /* ---------- DROPDOWNS ---------- */
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);

  const BORDER_COLOR = isDark ? "#2e2e2e" : "#cfcfcf";

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

  /* ---------- NEXT ---------- */
  const nextStep = () => {
    if (!businessName || !categoryId) {
      Alert.alert("Validation", "Business name and category are required");
      return;
    }
    if (promos.length < 3) {
      Alert.alert("Validation", "Minimum 3 promo images required");
      return;
    }

    navigation.navigate("AddBusinessSetup", {
      payload: {
        businessName,
        categoryId,
        description, // HTML string
        tags,
        avgPrice,
        phone,
        secondaryPhone,
        whatsapp,
        email,
        website,
        address1,
        address2,
        landmark,
        pinCode,
        countryId,
        stateId,
        districtId,
        mandal,
        village,
        thumbnail,
        promos,
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Add Business" navigation={navigation} showBack />

      <ScrollView contentContainerStyle={styles.container}>
        <Section title="Basic Info" />

        <Input label="Business Name" value={businessName} setValue={setBusinessName} border={BORDER_COLOR} />

        <Label text="Category" />
        <PickerBox border={BORDER_COLOR}>
          <Picker selectedValue={categoryId} onValueChange={setCategoryId}>
            <Picker.Item label="Select Category" value="" />
            {categories.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id} />
            ))}
          </Picker>
        </PickerBox>

        {/* -------- DESCRIPTION (RICH TEXT) -------- */}
        <Label text="Description" />

        <View
          style={[
            styles.richContainer,
            {
              borderColor: BORDER_COLOR,
              backgroundColor: colors.card,
            },
          ]}
        >
          <RichEditor
            ref={richRef}
            initialContentHTML={description}
            onChange={setDescription}
            placeholder="Describe your business..."
            editorStyle={{
              backgroundColor: colors.card,
              color: colors.text,
              placeholderColor: isDark ? "#888" : "#999",
              contentCSSText: "font-size: 14px;",
            }}
            style={{ minHeight: hp(18) }}
          />
        </View>

        <RichToolbar
          editor={richRef}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
          ]}
          iconTint={isDark ? "#aaa" : "#444"}
          selectedIconTint={colors.primary}
          style={[
            styles.toolbar,
            { backgroundColor: colors.card, borderColor: BORDER_COLOR },
          ]}
        />

        <Input label="Tags" value={tags} setValue={setTags} border={BORDER_COLOR} />
        <Input label="Average Price" value={avgPrice} setValue={setAvgPrice} border={BORDER_COLOR} />

        <Section title="Contact" />
        <Input label="Phone" value={phone} setValue={setPhone} border={BORDER_COLOR} />
        <Input label="Secondary Phone" value={secondaryPhone} setValue={setSecondaryPhone} border={BORDER_COLOR} />
        <Input label="WhatsApp" value={whatsapp} setValue={setWhatsapp} border={BORDER_COLOR} />
        <Input label="Email" value={email} setValue={setEmail} border={BORDER_COLOR} />
        <Input label="Website" value={website} setValue={setWebsite} border={BORDER_COLOR} />

        <Section title="Address" />
        <PickerWithLabel label="Country" value={countryId} setValue={setCountryId} data={countries} border={BORDER_COLOR} />
        <PickerWithLabel label="State" value={stateId} setValue={setStateId} data={states} border={BORDER_COLOR} />
        <PickerWithLabel label="District" value={districtId} setValue={setDistrictId} data={districts} border={BORDER_COLOR} />

        <Input label="Mandal" value={mandal} setValue={setMandal} border={BORDER_COLOR} />
        <Input label="Village / Town" value={village} setValue={setVillage} border={BORDER_COLOR} />
        <Input label="Address Line 1" value={address1} setValue={setAddress1} border={BORDER_COLOR} />
        <Input label="Address Line 2" value={address2} setValue={setAddress2} border={BORDER_COLOR} />
        <Input label="Landmark" value={landmark} setValue={setLandmark} border={BORDER_COLOR} />
        <Input label="Pin Code" value={pinCode} setValue={setPinCode} border={BORDER_COLOR} />

        <Section title="Images" />
        <ActionBtn text="Pick Thumbnail" onPress={pickThumbnail} />
        {thumbnail && <Image source={{ uri: thumbnail }} style={styles.preview} />}
        <ActionBtn text="Pick Promo Images (min 3)" onPress={pickPromos} />

        <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
          <Text style={styles.nextText}>Next →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- REUSABLES ---------- */

const Section = ({ title }) => <Text style={styles.section}>{title}</Text>;
const Label = ({ text }) => <Text style={styles.label}>{text}</Text>;

const Input = ({ label, value, setValue, border }) => (
  <>
    <Label text={label} />
    <TextInput
      value={value}
      onChangeText={setValue}
      style={[styles.input, { borderColor: border }]}
    />
  </>
);

const PickerWithLabel = ({ label, value, setValue, data, border }) => (
  <>
    <Label text={label} />
    <PickerBox border={border}>
      <Picker selectedValue={value} onValueChange={setValue}>
        <Picker.Item label={`Select ${label}`} value="" />
        {data.map((i) => (
          <Picker.Item key={i.id} label={i.name} value={i.id} />
        ))}
      </Picker>
    </PickerBox>
  </>
);

const PickerBox = ({ children, border }) => (
  <View style={[styles.pickerBox, { borderColor: border }]}>{children}</View>
);

const ActionBtn = ({ text, onPress }) => (
  <TouchableOpacity style={styles.btn} onPress={onPress}>
    <Ionicons name="image-outline" size={16} color="#fff" />
    <Text style={styles.btnText}>{text}</Text>
  </TouchableOpacity>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { padding: wp(4), paddingBottom: hp(6) },
  section: { fontSize: rf(16), fontWeight: "700", marginTop: hp(3) },
  label: { marginTop: hp(1), fontWeight: "600" },

  input: {
    borderWidth: 1,
    borderRadius: wp(2),
    padding: hp(1.2),
  },

  richContainer: {
    borderWidth: 1,
    borderRadius: wp(2),
    overflow: "hidden",
  },

  toolbar: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: wp(2),
    marginBottom: hp(1),
  },

  pickerBox: {
    borderWidth: 1,
    borderRadius: wp(2),
    marginTop: hp(0.5),
  },

  btn: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: hp(1.2),
    borderRadius: wp(2),
    marginTop: hp(1),
  },

  btnText: { color: "#fff", marginLeft: 8 },

  preview: { height: hp(18), borderRadius: wp(2), marginTop: hp(1) },

  nextBtn: {
    marginTop: hp(4),
    backgroundColor: "#1DB954",
    padding: hp(1.6),
    borderRadius: wp(3),
    alignItems: "center",
  },

  nextText: { color: "#fff", fontSize: rf(15), fontWeight: "700" },
});
