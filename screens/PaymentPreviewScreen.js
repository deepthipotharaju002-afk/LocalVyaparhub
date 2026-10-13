import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { hp, wp, rf } from "../utils/responsive";

export default function PaymentPreviewScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.centerBox}>
        {/* Title */}
        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          Business Registration Fee
        </Text>

        {/* Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card },
          ]}
        >
          <Text
            style={[
              styles.label,
              { color: colors.text },
            ]}
          >
            One-time payment
          </Text>

          <Text
            style={[
              styles.amount,
              { color: colors.primary },
            ]}
          >
            ₹1000
          </Text>

          <Text
            style={[
              styles.note,
              { color: colors.primary },
            ]}
          >
            This payment is required to activate your business listing.
          </Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary },
          ]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Payment")}
        >
          <Text style={styles.buttonText}>
            Proceed to Pay
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(6),
  },

  title: {
    fontSize: rf(22),
    fontWeight: "700",
    marginBottom: hp(3),
    textAlign: "center",
  },

  card: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: hp(3),
    paddingHorizontal: wp(6),
    alignItems: "center",
    marginBottom: hp(4),
    elevation: 3,
  },

  label: {
    fontSize: rf(14),
    opacity: 0.8,
  },

  amount: {
    fontSize: rf(36),
    fontWeight: "800",
    marginVertical: hp(1.2),
  },

  note: {
    fontSize: rf(13),
    textAlign: "center",
    lineHeight: rf(18),
    opacity: 0.9,
  },

  button: {
    width: "100%",
    paddingVertical: hp(1.8),
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: rf(16),
    fontWeight: "700",
  },
});
