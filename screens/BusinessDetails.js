// BusinessDetailsScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  StyleSheet,
  Dimensions,
  Share,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import Header from "../screens/Header";
import { hp, wp, rf } from "../utils/responsive";
import { fetchListingById } from "../utils/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addBookmark,
  getRatingStats,
  getBookmarks,
  addReview,
  recordBusinessView,
  
  getReviews,
} from "../utils/api"; // adjust the path to your API service

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public";
const { width } = Dimensions.get("window");

const BusinessDetailsScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
 const { business: initialBusiness = {} } = route.params || {};
const [business, setBusiness] = useState(initialBusiness);


  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState(business.rating || 4.3);
  const [rateCount, setRateCount] = useState(business.rateCount || 128);
  const [comments, setComments] = useState(business.comments || []);
  const [userStars, setUserStars] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);

  //const { businessview } = route.params;
  const [views, setViews] = useState(business.views || 0);

useEffect(() => {
  if (initialBusiness?.id && !initialBusiness.business_name) {
    fetchListingById(initialBusiness.id)
      .then((data) => {
        setBusiness(data);
      })
      .catch((err) => console.log("Fetch listing error:", err));
  }
}, []);

useFocusEffect(
  React.useCallback(() => {
    if (!business?.id) return;

    const updateViews = async () => {
      try {
        const total = await recordBusinessView(business.id);
        setViews(total);
      } catch (err) {
        console.warn("View update failed:", err);
      }
    };

    updateViews();

    // optional cleanup
    return () => {};
  }, [business.id])
);

useEffect(() => {
  const checkLogin = async () => {
    const userId = await AsyncStorage.getItem("user_id");
    const email = await AsyncStorage.getItem("email");

    if (userId) {
      setLoggedUser({ id: userId, email });
      setIsLoggedIn(true);
    } else {
      setLoggedUser(null);
      setIsLoggedIn(false);
    }
  };

  checkLogin();
}, []);



useFocusEffect(
  React.useCallback(() => {
    const loadBookmarkStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setBookmarked(false);
          return;
        }

        const bookmarks = await getBookmarks(); // API call
        const isBookmarked = bookmarks.some(
          (b) => b.listing_id === business.id
        );

        setBookmarked(isBookmarked);
      } catch (err) {
        console.log("Bookmark sync failed:", err.message);
      }
    };

    if (business?.id) {
      loadBookmarkStatus();
    }
  }, [business?.id])
);


  // 3️⃣ Load Reviews (THIS WAS MISSING)
useEffect(() => {
  if (!business?.id) return;

  const loadReviewsData = async () => {
    try {
      // Load reviews
      const res = await getReviews(business.id);

      // ✅ Handle paginated or direct array
      const reviewsArray = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];

      const formatted = reviewsArray.map(r => ({
        name: r.user?.name || "User",
        text: r.comment,
        stars: r.rating,
      }));

      setComments(formatted);


      // Load average rating & count
      const stats = await getRatingStats(business.id);
      setRating(stats.average.toFixed(1));
      setRateCount(stats.count);

    } catch (err) {
      console.error("loadReviews error:", err);
    }
  };

  loadReviewsData();
}, [business.id]);


  // Use promos from business object or fallback images
  const promoImages =
  business.promos && business.promos.length > 0
    ? business.promos.map((path) => ({
        uri: `${BASE_URL.replace("/api", "")}/${path}`,
      }))
    : [];


  // Distance calculation
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  

const toggleBookmark = async () => {
  if (!isLoggedIn) {
    Alert.alert("Login Required", "Please login to bookmark");
    return;
  }

  try {
    const res = await addBookmark(business.id);
    setBookmarked(res.bookmarked); // 🔥 backend truth
  } catch (err) {
    Alert.alert("Error", err.message);
  }
};


  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          setUserLocation(loc.coords);

          if (business?.latitude && business?.longitude) {
            const dist = getDistanceFromLatLonInKm(
              loc.coords.latitude,
              loc.coords.longitude,
              business.latitude,
              business.longitude
            );
            setDistance(dist);
          }

          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }
      } catch (err) {
        console.warn("Location error:", err);
      }
    })();
  }, []);

  // Auto scroll promo images
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % promoImages.length;
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: nextIndex * width, animated: true });
      }
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  function handleDirections(item) {
      const lat = item.latitude || item.village?.latitude;
      const lng = item.longitude || item.village?.longitude;
  
      const address = [
        item.business_name,
        item.address_line1,
        item.village?.name,
        item.mandal?.name,
        item.district?.name,
      ]
        .filter(Boolean)
        .join(", ");
  
      let url;
      if (lat && lng) {
        url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      } else if (address) {
        url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          address
        )}`;
      } else {
        Alert.alert("Location not available");
        return;
      }
  
      Linking.openURL(url);
    }


  const makeCall = () => {
    const phone = business.phone || business.mobile || business.contact_number;
    if (phone) Linking.openURL(`tel:${phone}`);
    else Alert.alert("No Number", "This business has not provided a contact number.");
  };

  const handleShare = async () => {
  if (!business?.id) return;

  const shareUrl = `https://localvyaparhub.com/LocalVyaparHub/public/api/listings-share/${business.id}`;

  try {
    await Share.share({
      message: `Check out ${business.business_name} on Local Vyapar Hub 🚀\n${shareUrl}`,
    });
  } catch (error) {
    console.error("Share error:", error);
  }
};



 const handleSubmitReview = async () => {
  // 🚫 Not logged in
  if (!isLoggedIn || !loggedUser?.id) {
    Alert.alert(
      "Login Required",
      "Please login to submit a review",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Login",
          onPress: () => navigation.navigate("Login"),
        },
      ]
    );
    return;
  }

  // 🚫 Missing input
  if (userStars === 0 || userReview.trim() === "") {
    Alert.alert(
      "Missing Info",
      "Please add both rating and review before submitting."
    );
    return;
  }

  try {
    await addReview({
      listing_id: business.id,
      rating: userStars,
      comment: userReview.trim(),
    });
    // ✅ Update UI instantly
    setComments((prev) => [
      ...prev,
      {
        name: loggedUser.name || "You",
        text: userReview.trim(),
        stars: userStars,
      },
    ]);

    setUserReview("");
    setUserStars(0);

    // ✅ Refresh rating
    const stats = await getRatingStats(business.id);
    setRating(stats.average.toFixed(1));
    setRateCount(stats.count);
  } catch (err) {
    console.error("Submit Review error:", err);
    Alert.alert("Error", "Could not submit review");
  }
};




  //const toggleBookmark = () => setBookmarked((p) => !p);

  const renderStars = (count, interactive = false) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let filled = i <= Math.floor(count);
    let half = !filled && i - 0.5 <= count; // handle half star

    stars.push(
      <TouchableOpacity
        key={i}
        disabled={!interactive}
        onPress={() => interactive && setUserStars(i)}
      >
        <FontAwesome
          name={filled ? "star" : half ? "star-half-o" : "star-o"}
          size={rf(18)}
          color={colors.primary}
          style={{ marginHorizontal: wp(0.6) }}
        />
      </TouchableOpacity>
    );
  }
  return stars;
};


 


  // Render opening hours dynamically
  const renderOpeningHours = () => {
  if (!business.opening_hours)
    return <Text style={{ color: colors.text }}>Not specified</Text>;

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  const hoursObj =
    typeof business.opening_hours === "string"
      ? JSON.parse(business.opening_hours || "{}")
      : business.opening_hours;

  return days.map(day => {
    const item = hoursObj[day];

    // item can be string OR object → handle both
    let displayText = "Closed";

    if (typeof item === "string") {
      displayText = item;
    } else if (item && typeof item === "object") {
      displayText = `${item.open || ""} - ${item.close || ""}`;
    }

    return (
      <View
        key={day}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: hp(0.3),
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "600" }}>{day}</Text>
        <Text style={{ color: colors.text }}>{displayText}</Text>
      </View>
    );
  });
};


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        currentLocation={business?.address || "Current Location"}
        navigation={navigation}
        showBack={true}
        showSettings={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image Carousel */}
          <View style={styles.imageWrapper}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentIndex(idx);
              }}
            >
              {promoImages.map((img, idx) => (
                <Image key={idx} source={img} style={[styles.promoImage, { width }]} />
              ))}
            </ScrollView>

            <View style={[styles.actionIconsBox, { backgroundColor: colors.card }]}>
              <TouchableOpacity onPress={handleShare} style={styles.smallTouch}>
                <Feather name="share-2" size={28} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleBookmark} style={styles.smallTouch}>
                <Ionicons
                  name={bookmarked ? "bookmark" : "bookmark-outline"}
                  size={28}
                  color={bookmarked ? colors.primary : colors.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.dotsContainer}>
              {promoImages.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { opacity: i === currentIndex ? 1 : 0.35, backgroundColor: colors.primary },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Business Info */}
          <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.businessName, { color: colors.text }]}>
              {business?.business_name || "Business Name"} <Text style={{ color: colors.secondary }}>✅</Text>
            </Text>
            <Text style={[styles.businessAddress, { color: colors.muted }]}>
              {business?.village?.name || "Business address here"}
            </Text>
              {/* <Text>{JSON.stringify(business.village, null, 2)}</Text> */}
            <View style={styles.rowBetween}>
              {distance && (
                <Animated.Text
                  style={[styles.distanceText, { color: colors.primary, opacity: fadeAnim }]}
                >
                  📍 {distance} km away
                </Animated.Text>
              )}
              <View style={styles.viewBox}>
                <Ionicons name="eye" size={rf(15)} color={colors.primary} />
                <Text style={{ color: colors.text, marginTop: 4 }}>
          {views || 0} views
        </Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={makeCall}>
              <Ionicons name="call" size={rf(16)} color="#fff" />
              <Text style={styles.btnText}>Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: colors.secondary }]} onPress={() => handleDirections(business)}>
              <MaterialIcons name="directions" size={rf(16)} color="#fff" />
              <Text style={styles.btnText}>Get Directions</Text>
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About Business</Text>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              {business?.description || "No description provided."}
            </Text>
          </View>

          {/* Opening Hours */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Opening Hours</Text>
            {renderOpeningHours()}
          </View>

          {/* Ratings + Review */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Rate Us</Text>
            <View style={styles.ratingRow}>
            <View style={styles.starRow}>{renderStars(parseFloat(rating))}</View>
            <Text style={[styles.rateText, { color: colors.text }]}>
              {rating} ({rateCount} ratings)
            </Text>
          </View>


            <Text style={[styles.subHeading, { color: colors.text }]}>Your Rating</Text>
            <View style={styles.starRow}>{renderStars(userStars, true)}</View>

            <TextInput
              value={userReview}
              onChangeText={setUserReview}
              placeholder="Write your review..."
              placeholderTextColor={colors.muted}
              style={[styles.reviewInput, { color: colors.text, backgroundColor: colors.card }]}
              multiline
            />

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
              onPress={handleSubmitReview}
            >
              <Text style={styles.submitText}>Submit Review</Text>
            </TouchableOpacity>
          </View>

          {/* Comments */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Customer Comments
            </Text>

            {comments.length === 0 ? (
                <Text style={{ color: colors.text, marginTop: 10 }}>
                  No reviews yet.
                </Text>
              ) : (
                comments.map((c, i) => (
                  <View key={i} style={styles.commentBox}>
                    <View style={styles.starRow}>{renderStars(c.stars)}</View>
                    <Text style={[styles.commentAuthor, { color: colors.primary }]}>{c.name}</Text>
                    <Text style={[styles.commentText, { color: colors.text }]}>{c.text}</Text>
                  </View>
                ))
              )}

          </View>


          <View style={{ height: hp(8) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BusinessDetailsScreen;



const styles = StyleSheet.create({
  container: { flex: 1 },
  imageWrapper: { position: "relative" },
  promoImage: { height: hp(28), resizeMode: "cover" },
  actionIconsBox: {
    position: "absolute",
    bottom: hp(1),
    left: wp(2),
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp(3),
    elevation: 5,
    paddingHorizontal: wp(1.5),
  },
  smallTouch: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(3),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: wp(0.5),
  },
  dotsContainer: {
    position: "absolute",
    bottom: hp(1.6),
    right: wp(4),
    flexDirection: "row",
  },
  dot: {
    width: wp(2.6),
    height: wp(2.6),
    borderRadius: wp(1.3),
    marginLeft: wp(1),
  },
  headerCard: {
    marginTop: hp(1),
    marginHorizontal: wp(5),
    padding: wp(3),
    borderRadius: wp(3),
    elevation: 2,
  },
  businessName: { fontSize: rf(20), fontWeight: "700" },
  businessAddress: { marginTop: hp(0.6), fontSize: rf(13) },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(1),
  },
  viewBox: { flexDirection: "row", alignItems: "center" },
  viewText: { fontSize: rf(13), marginLeft: wp(1) },
  distanceText: { fontWeight: "600", fontSize: rf(13) },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(5),
    marginTop: hp(1.2),
  },
  btn: {
    flex: 0.48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.2),
    borderRadius: wp(6),
  },
  btnText: { color: "#fff", fontWeight: "700", marginLeft: wp(2) },
  section: { marginHorizontal: wp(5), marginTop: hp(2.5) },
  sectionTitle: { fontSize: rf(16), fontWeight: "700", marginBottom: hp(0.8) },
  sectionText: { fontSize: rf(13), lineHeight: hp(2.3), textAlign: "justify" },
  timingBox: { flexDirection: "row", alignItems: "center", marginTop: hp(1) },
  timingText: { fontSize: rf(13), marginLeft: wp(1) },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: hp(0.5) },
  starRow: { flexDirection: "row", marginVertical: hp(0.5) },
  rateText: { fontSize: rf(13), marginLeft: wp(2), fontWeight: "600" },
  subHeading: { fontSize: rf(14), fontWeight: "600", marginTop: hp(1) },
  reviewInput: {
    borderRadius: wp(3),
    marginTop: hp(1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    fontSize: rf(13),
  },
  submitBtn: {
    marginTop: hp(1.5),
    alignSelf: "flex-end",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(3),
  },
  submitText: { color: "#fff", fontWeight: "600" },
  commentBox: { marginBottom: hp(1.5) },
  commentAuthor: { fontWeight: "700", fontSize: rf(13), marginTop: hp(0.3) },
  commentText: { fontSize: rf(13), marginTop: hp(0.3) },
});
