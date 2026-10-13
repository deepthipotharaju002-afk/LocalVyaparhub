import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Alert,
  Share,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { hp, wp, rf, scale } from "../utils/responsive";

export default function SettingsScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const navigation = useNavigation();

  // 🔹 Support links
  const supportLinks = [
    { title: "Terms And Conditions", icon: "document-text-outline", navigateTo: "TermsConditions" },
    { title: "About Us", icon: "information-circle-outline", navigateTo: "AboutUs" },
    { title: "Privacy Policy", icon: "lock-closed-outline", navigateTo: "PrivacyPolicy" },
    { title: "Contact Us", icon: "call-outline", navigateTo: "ContactUs" },
  ];

  // 🔹 App links
  const appLinks = [
    { title: "Rate App", icon: "star-outline" },
    { title: "Share App", icon: "share-social-outline" },
  ];

  // 🔹 Social links
  const socialLinks = [
    { title: "Follow on Instagram", icon: "instagram", color: "#E4405F", url: "https://www.instagram.com/localvyaparhub/" },
    { title: "Follow on X (Twitter)", icon: "twitter", color: "#1DA1F2", url: "https://x.com/localvyaparhub" },
    { title: "Follow on Facebook", icon: "facebook-square", color: "#1877F2", url: "https://www.facebook.com/localvyaparhub/" },
    { title: "Follow on YouTube", icon: "youtube-play", color: "#FF0000", url: "https://www.youtube.com/@LocalVyaparHub" },
    { title: "Follow on Pinterest", icon: "pinterest", color: "#E60023", url: "https://www.pinterest.com/localvyaparhub/" },
  ];

  // 🔹 Open external links
  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert("Unable to open this link");
    } catch (err) {
      console.error("Error opening URL:", err);
    }
  };

  // ⭐ RATE APP
  const rateApp = () => {
    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.localvyaparhub";

    Linking.openURL(playStoreUrl).catch(() =>
      Alert.alert("Error", "Unable to open Play Store")
    );
  };

  // 🔗 SHARE APP
  const shareApp = async () => {
    try {
      await Share.share({
        message:
          "📍 Discover local businesses near you with Local Vyapar Hub!\n\n" +
          "👉 Download now:\n" +
          "https://play.google.com/store/apps/details?id=com.localvyaparhub",
      });
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={rf(22)} color={colors.icon} />
            <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </View>

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Settings</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.leftRow}>
            <Ionicons name="moon-outline" size={rf(20)} color={colors.icon} />
            <Text style={[styles.cardText, { color: colors.text }]}>Night Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#ccc", true: colors.secondary }}
            thumbColor={isDark ? colors.primary : "#f4f3f4"}
          />
        </View>

        {/* Bookmarks */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Your Activity</Text>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("Bookmarks")}
        >
          <View style={styles.leftRow}>
            <Ionicons name="bookmark-outline" size={rf(20)} color={colors.icon} />
            <Text style={[styles.cardText, { color: colors.text }]}>Bookmarks</Text>
          </View>
          <Ionicons name="chevron-forward" size={rf(18)} color={colors.icon} />
        </TouchableOpacity>

        {/* Support */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Support</Text>
        {supportLinks.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate(item.navigateTo)}
          >
            <View style={styles.leftRow}>
              <Ionicons name={item.icon} size={rf(20)} color={colors.icon} />
              <Text style={[styles.cardText, { color: colors.text }]}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={rf(18)} color={colors.icon} />
          </TouchableOpacity>
        ))}

        {/* Stay In Touch */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Stay In Touch</Text>
        {appLinks.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => {
              if (item.title === "Rate App") rateApp();
              if (item.title === "Share App") shareApp();
            }}
          >
            <View style={styles.leftRow}>
              <Ionicons name={item.icon} size={rf(20)} color={colors.icon} />
              <Text style={[styles.cardText, { color: colors.text }]}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={rf(18)} color={colors.icon} />
          </TouchableOpacity>
        ))}

        {/* Social */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Connect with Us</Text>
        {socialLinks.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => openLink(item.url)}
          >
            <View style={styles.leftRow}>
              <FontAwesome name={item.icon} size={rf(20)} color={item.color} />
              <Text style={[styles.cardText, { color: colors.text }]}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={rf(18)} color={colors.icon} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: wp(5), paddingTop: hp(4) },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: hp(2) },
  logo: { width: wp(30), height: hp(6), resizeMode: "contain" },
  backButton: { flexDirection: "row", alignItems: "center", gap: wp(1.5) },
  backText: { fontSize: rf(16), fontWeight: "600" },
  sectionTitle: { fontSize: rf(15), fontWeight: "700", marginVertical: hp(1.5) },
  card: {
    borderRadius: scale(12),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    marginBottom: hp(1.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  cardText: { fontSize: rf(14), fontWeight: "500", marginLeft: wp(2) },
  leftRow: { flexDirection: "row", alignItems: "center" },
});
