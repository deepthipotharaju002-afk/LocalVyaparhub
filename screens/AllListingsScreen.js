import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  TextInput,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import Header from "../screens/Header";
import { hp, wp, rf } from "../utils/responsive";
import { fetchListings, getListingsByLocation } from "../utils/api";

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public";

const AllListingsScreen = ({ route, navigation }) => {
  const { isDark, colors } = useTheme();
  const { locationType, locationId, locationName } = route.params || {};

  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const onEndReachedCalledDuringMomentum = useRef(false);

  // ----------------------------------------
  // 🔒 SAFE RESPONSE NORMALIZER (IMPORTANT)
  // ----------------------------------------
  const normalizeResponse = (res) => {
    if (!res) {
      return { data: [], current_page: 1, last_page: 1, total: 0 };
    }

    // Paginated response
    if (Array.isArray(res.data)) {
      return {
        data: res.data,
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        total: res.total || res.data.length,
      };
    }

    // Plain array
    if (Array.isArray(res)) {
      return {
        data: res,
        current_page: 1,
        last_page: 1,
        total: res.length,
      };
    }

    return { data: [], current_page: 1, last_page: 1, total: 0 };
  };

  // ----------------------------------------
  // LOAD LISTINGS
  // ----------------------------------------
  const loadListings = async (pageNo = 1, isRefresh = false) => {
    if (loadingMore && !isRefresh) return;

    pageNo === 1 && !isRefresh ? setLoading(true) : setLoadingMore(true);
    setError("");

    try {
      let res;
      const filters = {};
      if (search) filters.search = search;

      if (locationType && locationId) {
        res = await getListingsByLocation(pageNo, {
          per_page: 20,
          ...filters,
          [`${locationType}_id`]: locationId,
        });
      } else {
        res = await fetchListings(pageNo, {
          per_page: 20,
          ...filters,
        });
      }

      const normalized = normalizeResponse(res);

      console.log(
        `[Listings] Page ${normalized.current_page}/${normalized.last_page} | Items: ${normalized.data.length}`
      );

      setLastPage(normalized.last_page);
      setTotal(normalized.total);

      setListings((prev) =>
        pageNo === 1 ? normalized.data : [...prev, ...normalized.data]
      );
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // ----------------------------------------
  // INITIAL LOAD / LOCATION CHANGE
  // ----------------------------------------
  useEffect(() => {
    setPage(1);
    setLastPage(1);
    setListings([]);
    onEndReachedCalledDuringMomentum.current = false;
    loadListings(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  // ----------------------------------------
  // LOAD MORE
  // ----------------------------------------
  const loadMore = () => {
    if (
      loading ||
      loadingMore ||
      page >= lastPage ||
      onEndReachedCalledDuringMomentum.current
    )
      return;

    const nextPage = page + 1;
    onEndReachedCalledDuringMomentum.current = true;

    setPage(nextPage);
    loadListings(nextPage);
  };

  // ----------------------------------------
  // PULL TO REFRESH
  // ----------------------------------------
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setLastPage(1);
    setListings([]);
    onEndReachedCalledDuringMomentum.current = false;
    loadListings(1, true);
  };

  // ----------------------------------------
  // SEARCH (commented remains untouched)
  // ----------------------------------------
  const onSearchSubmit = () => {
    setPage(1);
    setLastPage(1);
    setListings([]);
    onEndReachedCalledDuringMomentum.current = false;
    loadListings(1);
  };

  // ----------------------------------------
  // RENDER ITEM
  // ----------------------------------------
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
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
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
            {item.rating || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // ----------------------------------------
  // FOOTER
  // ----------------------------------------
  const renderFooter = () => {
    if (loadingMore) {
      return <ActivityIndicator style={{ marginVertical: hp(2) }} />;
    }

    if (page >= lastPage && listings.length > 0) {
      return <Text style={styles.noMoreText}>No more listings</Text>;
    }

    return null;
  };

  // ----------------------------------------
  // RENDER
  // ----------------------------------------
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header navigation={navigation} showBack showSettings={false} />

      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {locationName || "All Listings"}
        </Text>

        {/* <TouchableOpacity onPress={() => Alert.alert("Filter", "Coming soon")}>
          <Ionicons name="filter" size={rf(22)} color={colors.primary} />
        </TouchableOpacity> */}
      </View>

      {/* <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search businesses..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={onSearchSubmit}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View> */}

      {!loading && (
        <Text style={styles.countText}>
          Showing {listings.length} of {total}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: hp(10) }} />
      ) : error ? (
        <View style={styles.centerView}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

export default AllListingsScreen;


/* ------------------------------------------------- */
/* STYLES */
/* ------------------------------------------------- */
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

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    marginHorizontal: wp(4),
    borderRadius: 10,
    paddingHorizontal: wp(3),
    marginBottom: hp(1),
  },

  searchInput: {
    flex: 1,
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    fontSize: rf(14),
  },

  countText: {
    marginHorizontal: wp(4),
    marginBottom: hp(1),
    fontSize: rf(12),
    color: "#777",
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

  noMoreText: {
    textAlign: "center",
    paddingVertical: hp(2),
    color: "#999",
    fontSize: rf(12),
  },
});
