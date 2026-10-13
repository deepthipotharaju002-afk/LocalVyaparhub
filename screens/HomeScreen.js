// HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import Header from "./Header";
import { hp, wp, rf } from "../utils/responsive";
import { fetchListings, getCategories } from "../utils/api";

import HomeSearchBar from "../components/HomeSearchBar";
import FeaturedListings from "../components/FeaturedListings";
import AllListings from "../components/AllListings";
import CategoriesSection from "../components/CategoriesSection";
import SearchResults from "../components/SearchResults";

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public";
export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  // ---------------- DATA ----------------
  const [featured, setFeatured] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [hotLocations, setHotLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ---------------- SEARCH ----------------
  const [categorySearchText, setCategorySearchText] = useState("");
  const [locationSearchText, setLocationSearchText] = useState("");

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);


  const [filteredCategorySuggestions, setFilteredCategorySuggestions] = useState([]);
  const [filteredLocationSuggestions, setFilteredLocationSuggestions] = useState([]);

  const isSearching =
  categorySearchText.trim().length > 0 ||
  locationSearchText.trim().length > 0;


  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    loadHomeData();
  }, []);
  useEffect(() => {
  if (isSearching) {
    buildSearchResults();
  } else {
    setSearchResults([]);
  }
}, [categorySearchText, locationSearchText, allListings]);


  async function loadHomeData() {
  setLoading(true);
  setLoadingCategories(true);

  try {
    // ⭐ FEATURED (NO SHUFFLE)
    const featuredRes = await fetchListings(1, { is_featured: 1 });
    setFeatured(Array.isArray(featuredRes?.data) ? featuredRes.data : []);

    // 🔹 ALL LISTINGS (SHUFFLE HERE ✅)
    const allRes = await fetchListings(1);
    const listings = Array.isArray(allRes?.data) ? allRes.data : [];
    const shuffledListings = shuffleArray(listings);
    setAllListings(shuffledListings);

    // 📂 CATEGORIES
    const catRes = await getCategories();
    setCategories(Array.isArray(catRes) ? catRes : []);

    // 🔥 HOT LOCATIONS (use shuffled or original – both OK)
    buildHotLocations(shuffledListings);
  } catch (err) {
    console.error("Home load error:", err);
  } finally {
    setLoading(false);
    setLoadingCategories(false);
  }
}

function normalize(text = "") {
  return text.toString().toLowerCase().trim();
}

function buildSearchResults() {
  const categoryText = normalize(categorySearchText);
  const locationText = normalize(locationSearchText);

  // ❌ Nothing typed → clear results
  if (!categoryText && !locationText) {
    setSearchResults([]);
    return;
  }

  const results = allListings.filter((item) => {
    // ---------- CATEGORY ----------
    const categoryName =
      normalize(item.category?.name) ||
      normalize(item.category_name);

    const categoryMatch =
      categoryText &&
      categoryName.includes(categoryText);

    // ---------- LOCATION ----------
    const locationMatch =
      locationText &&
      (
        normalize(item.village?.name).includes(locationText) ||
        normalize(item.mandal?.name).includes(locationText) ||
        normalize(item.district?.name).includes(locationText)
      );

    // ✅ OR logic → SHOW ALL MATCHING ITEMS
    return categoryMatch || locationMatch;
  });

  setSearchResults(results);
}




function shuffleArray(arr = []) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}


  // ---------------- HOT LOCATIONS ----------------
  function buildHotLocations(listings) {
    const map = new Map();

    listings.forEach((item) => {
      const v = item.village;
      //alert(`Thumbnail exists for ${JSON.stringify(v, null, 2)}`);

      if (v && Number(v.is_popular) === 1) {
        if (!map.has(v.id)) {
          map.set(v.id, {
            id: v.id,
            name: v.name,
            locationType: "village",
            thumbnail: v.thumbnail,
          });
        }
      }
    });

    setHotLocations(Array.from(map.values()));
  }

  // ---------------- SEARCH HANDLERS ----------------
  function onCategoryInputChange(text) {
    setCategorySearchText(text);
    setShowCategoryDropdown(text.length > 0);
    setShowLocationDropdown(false);

    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCategorySuggestions(filtered);
  }

  function onLocationInputChange(text) {
    setLocationSearchText(text);
    setShowLocationDropdown(text.length > 0);
    setShowCategoryDropdown(false);

    const filtered = hotLocations.filter((l) =>
      l.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLocationSuggestions(filtered);
  }

  // ---------------- RENDER ----------------
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header navigation={navigation} />

      {/* 🔍 SEARCH BAR */}
      <HomeSearchBar
        colors={colors}
        isDark={isDark}
        categoryText={categorySearchText}
        locationText={locationSearchText}
        onCategoryChange={onCategoryInputChange}
        onLocationChange={onLocationInputChange}
        showCategoryDropdown={showCategoryDropdown}
        showLocationDropdown={showLocationDropdown}
        categorySuggestions={filteredCategorySuggestions}
        locationSuggestions={filteredLocationSuggestions}
        onSelectCategory={(item) => {
          setCategorySearchText(item.name);
          setShowCategoryDropdown(false);
        }}
        onSelectLocation={(item) => {
          setLocationSearchText(item.name);
          setShowLocationDropdown(false);
        }}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: hp(6) }}>

          {/* 📂 CATEGORIES (ALWAYS VISIBLE) */}
            <CategoriesSection
              data={categories}
              loading={loadingCategories}
            />

            {/* 🔍 SEARCH RESULTS (NEW BLOCK ONLY) */}
            {isSearching && (
              <SearchResults data={searchResults} />
            )}

            {/* ⭐ FEATURED (ALWAYS VISIBLE) */}
            <FeaturedListings
              data={featured}
              loading={loading}
            />

            {/* 🔹 ALL LISTINGS */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>All Listings</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AllListingsScreen")}
              >
                <Text style={[styles.seeAllText, { color: colors.primary }]}>See All →</Text>
              </TouchableOpacity>
            </View>

            <AllListings
              data={allListings}
              loading={loading}
            />

            {/* 🔥 HOT LOCATIONS */}
            {/* 🔥 HOT LOCATIONS */}
            {hotLocations.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Hot Locations</Text>
                <View style={styles.hotGrid}>
                  {hotLocations.map((loc) => (
                    <View key={loc.id} style={styles.hotWrapper}>
                      <TouchableOpacity
                        style={styles.hotTile}
                        onPress={() =>
                          navigation.navigate("AllListingsScreen", {
                            locationType: "village",
                            locationId: loc.id,
                            locationName: loc.name,
                          })
                        }
                      >
                        {loc.thumbnail ? (
                          <Image
                            source={{ uri: `${BASE_URL}/${loc.thumbnail}` }}
                            style={styles.hotImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.hotPlaceholder}>
                            <Text style={[styles.hotText, { color: colors.text }]}>{loc.name}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {/* Village name below the card */}
                      <Text style={[styles.hotName, { color: colors.text }]} numberOfLines={1}>
                        {loc.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>

      )}
    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: rf(18),
    fontWeight: "700",
    marginHorizontal: wp(3),
    marginVertical: hp(1.5),
  },

 
  hotText: {
    fontSize: rf(14),
    fontWeight: "700",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(3),
  },

  seeAllText: {
    fontSize: rf(13),
    fontWeight: "700",
    color: "#007AFF",
  },


hotGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: wp(3),
},

hotWrapper: {
  width: "48%",
  marginBottom: wp(4),
},

hotTile: {
  width: "100%",
  height: hp(12), // height of the card
  backgroundColor: "#eeeeee23",
  borderRadius: 14,
  overflow: "hidden", // ensures image fits within rounded corners
  textTransform: "capitalize", 
},

hotImage: {
  width: "100%",
  height: "100%",
},

hotPlaceholder: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#eeeeee23",
},

hotName: {
  fontSize: rf(14),
  fontWeight: "700",
  textAlign: "center",
  marginTop: 6,
  textTransform: "capitalize", 
},

});
