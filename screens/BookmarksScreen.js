import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { hp, wp, rf } from "../utils/responsive";
import Header from "../screens/Header";
import { getBookmarks } from "../utils/api";

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public/";

export default function BookmarksScreen({ navigation }) {
  const { colors } = useTheme();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      // Use user id or fallback to 1 for testing
      const userId = user?.id || 1;

      const bookmarksData = await getBookmarks(userId);
      setBookmarks(bookmarksData);
    } catch (error) {
      console.log("Error fetching bookmarks:", error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header navigation={navigation} showBack={true} showSettings={false} />

      <Text
        style={{
          fontSize: rf(18),
          fontWeight: "700",
          marginLeft: wp(4),
          marginBottom: hp(1),
          color: colors.text,
        }}
      >
        Your Bookmarks
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: hp(20) }}
        />
      ) : bookmarks.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            marginTop: hp(15),
            color: colors.text,
            fontSize: rf(14),
          }}
        >
          No bookmarks found.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: hp(5) }}>
          {bookmarks.map((item) => {
            const biz = item.listing;

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: colors.card }]}
                onPress={() =>
                  navigation.navigate("BusinessDetails", { business: biz })
                }
              >
                {biz.thumbnail ? (
                  <Image
                    source={{ uri: `${BASE_URL}${biz.thumbnail}` }}
                    style={styles.image}
                  />
                ) : (
                  <View style={[styles.image, { backgroundColor: "#ccc" }]} />
                )}

                <View style={styles.infoBox}>
                  <Text
                    style={[styles.title, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {biz.business_name}
                  </Text>
                  <Text style={[styles.address, { color: colors.subtitle }]}>
                    {biz.address_line1}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginHorizontal: wp(4),
    marginBottom: hp(1.5),
    elevation: 2,
    borderRadius: wp(3),
    overflow: "hidden",
  },
  image: {
    width: wp(28),
    height: hp(13),
    resizeMode: "cover",
  },
  infoBox: {
    flex: 1,
    padding: wp(3),
  },
  title: {
    fontSize: rf(15),
    fontWeight: "700",
  },
  address: {
    fontSize: rf(12),
    marginTop: hp(0.5),
  },
});
