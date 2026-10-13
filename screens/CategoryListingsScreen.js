import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import Header from "../screens/Header";
import { hp, wp, rf } from "../utils/responsive";
import { getCategoryListings } from "../utils/api";

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public";

const CategoryListingsScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params || {};
  const { colors, isDark } = useTheme();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (!categoryId) return;

    setLoading(true);
    getCategoryListings(categoryId)
      .then((res) => setListings(Array.isArray(res) ? res : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryId]);

  const filteredListings = listings.filter((biz) => {
    const rating = parseFloat(biz.rating || 0);
    if (activeFilter === "Top Rated") return rating >= 4.7;
    return true;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.card,
        { backgroundColor: colors.card ?? (isDark ? "#1f1f1f" : "#fff") },
      ]}
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
        <View
          style={[
            styles.cardImage,
            { backgroundColor: isDark ? "#333" : "#e5e5e5" },
          ]}
        />
      )}

      <View style={styles.cardInfo}>
        <Text
          style={[styles.cardTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.business_name}
        </Text>

        <Text
          style={[styles.cardSubtitle, { color: colors.subtitle ?? "#666" }]}
          numberOfLines={2}
        >
          {item.address_line1}
          {item.address_line2 ? `, ${item.address_line2}` : ""}
        </Text>

        <View style={styles.cardFooter}>
          <Ionicons
            name="star"
            size={rf(14)}
            color={colors.primary}
            style={{ marginRight: wp(1) }}
          />
          <Text style={{ color: colors.primary }}>
            {item.rating || "0.0"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header navigation={navigation} showBack showSettings={false} />

      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {categoryName || "Category Listings"}
        </Text>

        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons
            name="filter"
            size={rf(22)}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: hp(10) }} />
      ) : filteredListings.length === 0 ? (
        <View style={styles.centerView}>
          <Text style={{ color: colors.text }}>
            No listings available.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* FILTER MODAL */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: colors.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Filter Options
            </Text>

            {["All", "Top Rated"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.modalOption,
                  activeFilter === opt && {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => {
                  setActiveFilter(opt);
                  setFilterVisible(false);
                }}
              >
                <Text
                  style={{
                    color: activeFilter === opt ? "#fff" : colors.text,
                    fontSize: rf(15),
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryListingsScreen;
const styles = StyleSheet.create({
  container: { flex: 1 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },

  headerTitle: {
    fontSize: rf(18),
    fontWeight: "700",
  },

  listContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(8),
  },

  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    flexDirection: "row",
    borderRadius: wp(4),
    elevation: 2,
    marginBottom: hp(2),
    overflow: "hidden",
  },

  cardImage: {
    width: wp(28),
    height: hp(13),
    resizeMode: "cover",
  },

  cardInfo: {
    flex: 1,
    padding: wp(3),
    justifyContent: "space-between",
  },

  cardTitle: {
    fontSize: rf(15),
    fontWeight: "700",
  },

  cardSubtitle: {
    fontSize: rf(12),
    marginVertical: hp(0.5),
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    padding: wp(5),
    borderRadius: wp(4),
    width: "80%",
  },

  modalTitle: {
    fontSize: rf(17),
    fontWeight: "700",
    marginBottom: hp(1.5),
    textAlign: "center",
  },

  modalOption: {
    paddingVertical: hp(1.5),
    alignItems: "center",
    borderRadius: wp(3),
    marginTop: hp(1),
  },
});
