import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Header from "../screens/Header";
import { useTheme } from "../context/ThemeContext";

const AboutUsScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors?.background || "#fff" }}>
      <Header
        title="About Us"
        navigation={navigation}
        showBack={true}
        showSettings={false}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          About Local Vyapar Hub
        </Text>

        <Text style={[styles.text, { color: colors.text }]}>
          Local Vyapar Hub is your go-to online business directory, designed to
          connect local businesses with their communities. Whether you’re a
          startup, SME, or established enterprise, our platform provides the
          visibility you need to thrive in today’s competitive market.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Features & Benefits
        </Text>

        <Text style={[styles.text, { color: colors.text }]}>
          <Text style={[styles.bold, { color: colors.text }]}>
            Comprehensive Listings:
          </Text>{" "}
          Showcase your business with detailed profiles, including contact
          information, service offerings, customer reviews, and more.{"\n\n"}
          <Text style={[styles.bold, { color: colors.text }]}>
            SEO-Optimized Profiles:
          </Text>{" "}
          Enhance your online presence with SEO-friendly listings that make it
          easier for customers to find you.{"\n\n"}
          <Text style={[styles.bold, { color: colors.text }]}>
            User-Friendly Interface:
          </Text>{" "}
          Our platform is designed for easy navigation, ensuring a seamless
          experience for both businesses and customers.{"\n\n"}
          <Text style={[styles.bold, { color: colors.text }]}>
            Cost-Effective Marketing:
          </Text>{" "}
          Affordable listing packages that offer significant ROI for your
          business.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          How It Works
        </Text>

        <Text style={[styles.text, { color: colors.text }]}>
          <Text style={[styles.bold, { color: colors.text }]}>
            Step 1: Sign Up –{" "}
          </Text>
          Create an account and choose a listing package that suits your
          needs.{"\n\n"}
          <Text style={[styles.bold, { color: colors.text }]}>
            Step 2: Complete Your Profile –{" "}
          </Text>
          Fill in your business details, upload images, and describe your
          services.{"\n\n"}
          <Text style={[styles.bold, { color: colors.text }]}>
            Step 3: Go Live –{" "}
          </Text>
          Once approved, your listing will be live on Local Vyapar Hub, ready to
          attract customers.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    textAlign: "justify",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "600",
  },
});

export default AboutUsScreen;
