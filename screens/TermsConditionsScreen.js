import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../screens/Header";
import { useTheme } from "../context/ThemeContext";
import { hp, wp, rf, scale } from "../utils/responsive";
import { useNavigation } from "@react-navigation/native";

export default function TermsConditionsScreen() {
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
      <Header title="Terms & Conditions" navigation={navigation} showBack={true} showSettings={false}/>

      {/* ✅ Scrollable Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. Acceptance of Terms */}
        <View style={styles.section}>
          <Text style={styles.title}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing or using the Local Vyapar Hub website
            (https://localvyaparhub.com), you agree to comply with and be bound
            by these Terms and Conditions. If you do not agree to these terms,
            please do not use our website.
          </Text>
        </View>

        {/* 2. User Accounts */}
        <View style={styles.section}>
          <Text style={styles.title}>2. User Accounts</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Registration:</Text> To add a
            business listing or access certain features, you may be required to
            create an account. You must provide accurate and complete
            information during the registration process.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Account Security:</Text> You are
            responsible for maintaining the confidentiality of your account
            login credentials and for all activities that occur under your
            account. Notify us immediately if you suspect any unauthorized use
            of your account.
          </Text>
        </View>

        {/* 3. Business Listings */}
        <View style={styles.section}>
          <Text style={styles.title}>3. Business Listings</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Listing Submission:</Text> Users
            can add their business listings to the directory. You must ensure
            that all information provided in the listings is accurate, current,
            and lawful.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Listing Review:</Text> We
            reserve the right to review, edit, or remove any listings that
            violate our guidelines, contain inaccurate information, or are
            deemed inappropriate.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>User Responsibility:</Text> You
            are responsible for ensuring that your listings do not infringe on
            the rights of others or violate any laws.
          </Text>
        </View>

        {/* 4. User Conduct */}
        <View style={styles.section}>
          <Text style={styles.title}>4. User Conduct</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Prohibited Activities:</Text> You
            agree not to engage in any conduct that could damage, disable, or
            impair the functionality of the site. This includes, but is not
            limited to:
          </Text>
          <Text style={styles.listItem}>1. Posting false or misleading information.</Text>
          <Text style={styles.listItem}>2. Using the site to distribute spam, viruses, or other harmful software.</Text>
          <Text style={styles.listItem}>3. Attempting to gain unauthorized access to other users’ accounts.</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Compliance with Laws:</Text> You
            agree to comply with all applicable laws and regulations while using
            our website.
          </Text>
        </View>

        {/* 5. Intellectual Property */}
        <View style={styles.section}>
          <Text style={styles.title}>5. Intellectual Property</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Site Content:</Text> All content
            on this site, including text, graphics, logos, and images, is the
            property of Local Vyapar Hub or its licensors and is protected by
            copyright, trademark, and other intellectual property laws.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>User Submissions:</Text> By
            submitting content to the site, you grant Local Vyapar Hub a
            non-exclusive, royalty-free, worldwide license to use, reproduce,
            modify, and display the content in connection with the operation of
            the site.
          </Text>
        </View>

        {/* 6. Limitation of Liability */}
        <View style={styles.section}>
          <Text style={styles.title}>6. Limitation of Liability</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Disclaimer:</Text> The
            information provided on this site is for general informational
            purposes only. We do not guarantee the accuracy, completeness, or
            reliability of the information.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>No Liability:</Text> Local
            Vyapar Hub shall not be liable for any direct, indirect, incidental,
            consequential, or punitive damages arising from your use of, or
            inability to use, the site.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Third-Party Links:</Text> The
            site may contain links to third-party websites. We are not
            responsible for the content or practices of these external sites.
          </Text>
        </View>

        {/* 7. Termination of Access */}
        <View style={styles.section}>
          <Text style={styles.title}>7. Termination of Access</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Termination Rights:</Text> We
            reserve the right to terminate or suspend your access to the site at
            any time, without notice, for conduct that we believe violates these
            Terms and Conditions or is harmful to other users, us, or third
            parties.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>User Termination:</Text> You may
            terminate your account at any time by contacting us. Upon
            termination, your right to use the site will immediately cease.
          </Text>
        </View>

        {/* 8. Changes to Terms */}
        <View style={styles.section}>
          <Text style={styles.title}>8. Changes to Terms</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Modifications:</Text> We may
            update these Terms and Conditions from time to time. Any changes
            will be effective immediately upon posting the revised terms on this
            page.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "600" }}>Continued Use:</Text> Your
            continued use of the site following the posting of changes
            constitutes your acceptance of the revised terms.
          </Text>
        </View>

        {/* 9. Governing Law */}
        <View style={styles.section}>
          <Text style={styles.title}>9. Governing Law</Text>
          <Text style={styles.text}>
            These Terms and Conditions are governed by and construed in
            accordance with the laws of India, without regard to its conflict of
            law principles. Any legal action or proceeding arising under these
            Terms will be brought exclusively in the courts of Mangalagiri.
          </Text>
        </View>

        {/* 10. Contact Information */}
        <View style={styles.section}>
          <Text style={styles.title}>10. Contact Information</Text>
          <Text style={styles.text}>If you have any questions or concerns about these Terms and Conditions, please contact us at:</Text>
          <Text style={styles.contact}>📧 Email: contact@localvyaparhub.com</Text>
          <Text style={styles.contact}>
            🏠 Address: 7-66, Gowthambudda Road, Near Bismillah Dum Biryani
            Center, Mangalagiri, A.P-522503
          </Text>
          <Text style={styles.contact}>📞 Phone: +91 8978176263</Text>
        </View>
      </ScrollView>
    </View>
  );
}
