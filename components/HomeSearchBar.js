// components/HomeSearchBar.js
import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { hp, wp, rf } from "../utils/responsive";

export default function HomeSearchBar({
  colors,
  isDark,

  // values
  categoryText,
  locationText,

  // input handlers
  onCategoryChange,
  onLocationChange,

  // dropdown control
  showCategoryDropdown,
  showLocationDropdown,

  // data
  categorySuggestions = [],
  locationSuggestions = [],

  // selection handlers
  onSelectCategory,
  onSelectLocation,
}) {
  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerArea}
    >
      <View style={styles.searchWrapper}>

        {/* ================= CATEGORY SEARCH ================= */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: isDark ? "#2A2A2A" : "#fff" },
          ]}
        >
          <Ionicons name="search" size={18} color={isDark ? "#bbb" : "#777"} />
          <TextInput
            placeholder="Search category"
            placeholderTextColor={isDark ? "#aaa" : "#999"}
            value={categoryText}
            onChangeText={onCategoryChange}
            style={[styles.searchInput, { color: isDark ? "#fff" : "#333" }]}
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        {showCategoryDropdown && categorySuggestions.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={categorySuggestions}
              keyExtractor={(item) => `cat_${item.id}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    Keyboard.dismiss();
                    onSelectCategory(item);
                  }}
                >
                  <Text style={styles.dropdownText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ================= LOCATION SEARCH ================= */}
        <View
          style={[
            styles.searchBox,
            {
              marginTop: hp(1),
              backgroundColor: isDark ? "#2A2A2A" : "#fff",
            },
          ]}
        >
          <Ionicons
            name="location-outline"
            size={18}
            color={isDark ? "#bbb" : "#777"}
          />
          <TextInput
            placeholder="Search location"
            placeholderTextColor={isDark ? "#aaa" : "#999"}
            value={locationText}
            onChangeText={onLocationChange}
            style={[styles.searchInput, { color: isDark ? "#fff" : "#333" }]}
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        {showLocationDropdown && locationSuggestions.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={locationSuggestions}
              keyExtractor={(item) => `loc_${item.id}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    Keyboard.dismiss();
                    onSelectLocation(item);
                  }}
                >
                  <Text style={styles.dropdownText}>{item.name}</Text>
                  {item.type && (
                    <Text style={styles.dropdownSub}>{item.type}</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  headerArea: {
    paddingTop: hp(3),
    paddingBottom: hp(3),
    paddingHorizontal: wp(4),
    zIndex: 9999,
  },

  searchWrapper: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 18,
    padding: wp(3),
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: wp(3),
    height: hp(5.5),
  },

  searchInput: {
    flex: 1,
    marginLeft: wp(2),
    fontSize: rf(14),
    color: "#333",
  },

  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: hp(0.5),
    maxHeight: hp(30),
    elevation: 8,
    zIndex: 99999,
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },

  dropdownText: {
    fontSize: rf(14),
    color: "#333",
    fontWeight: "600",
  },

  dropdownSub: {
    fontSize: rf(11),
    color: "#888",
    marginTop: 2,
  },
});