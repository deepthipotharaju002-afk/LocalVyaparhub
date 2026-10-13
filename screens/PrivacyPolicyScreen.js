import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../screens/Header";
import { useTheme } from "../context/ThemeContext";
import { hp, wp, rf, scale } from "../utils/responsive";
import { useNavigation } from "@react-navigation/native";

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: wp(5),
      paddingBottom: hp(5),
    },
    section: {
      marginBottom: hp(2),
    },
    title: {
      fontSize: rf(18),
      fontWeight: "700",
      color: colors.primary,
      marginBottom: hp(1),
    },
    text: {
      fontSize: rf(14),
      color: colors.text,
      lineHeight: hp(2.8),
      textAlign: 'justify'
    },
    listItem: {
      fontSize: rf(14),
      color: colors.text,
      lineHeight: hp(2.8),
      marginLeft: wp(3),
    },
    contact: {
      fontSize: rf(14),
      color: colors.secondary,
      marginTop: hp(0.5),
    },
  });

  return (
    <View style={styles.container}>
      {/* ✅ Header */}
      <Header title="Privacy Policy" navigation={navigation} showBack={true} showSettings={false} />

      {/* ✅ Scrollable Policy Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. Introduction */}
        <View style={styles.section}>
          <Text style={styles.title}>1. Introduction</Text>
          <Text style={styles.text}>
            Welcome to Local Vyapar Hub. We are committed to protecting your
            privacy. This Privacy Policy outlines how we collect, use, and
            safeguard your information when you use our website,
            https://localvyaparhub.com.
          </Text>
        </View>

        {/* 2. Information We Collect */}
        <View style={styles.section}>
          <Text style={styles.title}>2. Information We Collect</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Personal Information:</Text> When
            you register or add a listing, we may collect personal information
            such as your name, email address, and contact details.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Business Information:</Text> For
            business listings, we collect details including business name,
            address, phone number, and other relevant information.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Usage Data:</Text> We collect
            data on how you interact with our site, including pages visited and
            time spent on the site.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Cookies:</Text> We use cookies
            and similar tracking technologies to enhance your experience.
          </Text>
        </View>

        {/* 3. How We Use Your Information */}
        <View style={styles.section}>
          <Text style={styles.title}>3. How We Use Your Information</Text>
          <Text style={styles.listItem}>1. To display business listings and provide our services.</Text>
          <Text style={styles.listItem}>2. To communicate with you regarding your listings or inquiries.</Text>
          <Text style={styles.listItem}>3. To personalize your experience and improve our website.</Text>
          <Text style={styles.listItem}>4. To comply with legal obligations and protect our rights.</Text>
        </View>

        {/* 4. Sharing of Information */}
        <View style={styles.section}>
          <Text style={styles.title}>4. Sharing of Information</Text>
          <Text style={styles.listItem}>1. We do not sell or rent your personal information to third parties.</Text>
          <Text style={styles.listItem}>2. We may share information with third-party service providers who assist us in operating the site.</Text>
          <Text style={styles.listItem}>3. Information may be shared in response to legal requests or to protect our rights.</Text>
        </View>

        {/* 5. Cookies and Tracking Technologies */}
        <View style={styles.section}>
          <Text style={styles.title}>5. Cookies and Tracking Technologies</Text>
          <Text style={styles.listItem}>1. We use cookies to store user preferences and enhance user experience.</Text>
          <Text style={styles.listItem}>2. You can manage or disable cookies through your browser settings.</Text>
        </View>

        {/* 6. Your Rights */}
        <View style={styles.section}>
          <Text style={styles.title}>6. Your Rights</Text>
          <Text style={styles.listItem}>1. You have the right to access, correct, or delete your personal information.</Text>
          <Text style={styles.listItem}>2. You can opt out of marketing communications by following the unsubscribe instructions in our emails.</Text>
        </View>

        {/* 7. Data Security */}
        <View style={styles.section}>
          <Text style={styles.title}>7. Data Security</Text>
          <Text style={styles.listItem}>1. We implement security measures to protect your information from unauthorized access.</Text>
          <Text style={styles.listItem}>2. However, no online transmission is 100% secure, and we cannot guarantee absolute security.</Text>
        </View>

        {/* 8. Changes */}
        <View style={styles.section}>
          <Text style={styles.title}>8. Changes to This Privacy Policy</Text>
          <Text style={styles.text}>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated effective date.
          </Text>
        </View>

        {/* 9. Contact */}
        <View style={styles.section}>
          <Text style={styles.title}>9. Contact Us</Text>
          <Text style={styles.text}>If you have any questions about this Privacy Policy, please contact us at:</Text>
          <Text style={styles.contact}>📧 Email: contact@localvyaparhub.com</Text>
          <Text style={styles.contact}>📞 Phone: 8978176263</Text>
        </View>
      </ScrollView>
    </View>
  );
}
