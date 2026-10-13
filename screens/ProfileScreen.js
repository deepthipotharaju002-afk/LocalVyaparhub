import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import { scale, verticalScale, moderateScale } from "../utils/responsive";
import Header from "../screens/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const { isDark, colors } = useTheme();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.log("Failed to load user:", e.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const defaultAvatar = (
    <View
      style={{
        width: scale(80),
        height: scale(80),
        borderRadius: scale(40),
        backgroundColor: colors.primary + "33",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons name="account" size={40} color={colors.primary} />
    </View>
  );

  if (loading) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Header
        navigation={navigation}
        showBack
        showSettings
        location="Profile"
      />

      <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(50) }}>
        {/* PROFILE HEADER */}
        <View style={styles.profileHeader}>
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.logo} />
          ) : (
            defaultAvatar
          )}

          <View style={styles.infoContainer}>
            {user ? (
              <>
                <Text style={[styles.name, { color: colors.text }]}>
                  {user.name}
                </Text>
                <Text style={[styles.email, { color: colors.text }]}>
                  {user.email}
                </Text>
                <Text style={[styles.mobile, { color: colors.text }]}>
                  {user.phone}
                </Text>
              </>
            ) : (
              <Text style={[styles.name, { color: colors.text }]}>
                You are not logged in
              </Text>
            )}
          </View>
        </View>

        {/* USER LOGGED IN */}
        {user ? (
          <>
            {/* DETAILS */}
            <View
              style={[
                styles.detailsContainer,
                { backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF" },
              ]}
            >
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.text }]}>
                  Address
                </Text>
                <Text style={[styles.detailValue, { color: colors.primary }]}>
                  {user.address || "—"}
                </Text>
              </View>
            </View>

            {/* ADD LISTING */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Add")}
              style={styles.btnWrapper}
            >
              <LinearGradient
                colors={[colors.primary, "#4facfe"]}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Add Listing</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* LOGOUT */}
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.clear();
                navigation.replace("Login");
              }}
              style={styles.btnWrapper}
            >
              <LinearGradient
                colors={["#FF3B30", "#FF5C5C"]}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* LOGIN WITH OTP */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.btnWrapper}
            >
              <LinearGradient
                colors={[colors.primary, "#4facfe"]}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Login with OTP</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scale(20),
    marginTop: verticalScale(25),
  },
  logo: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
  },
  infoContainer: { flex: 1, marginLeft: scale(15) },
  name: { fontSize: moderateScale(22), fontWeight: "700" },
  email: { fontSize: moderateScale(14), marginTop: verticalScale(4) },
  mobile: { fontSize: moderateScale(14), marginTop: verticalScale(4) },

  detailsContainer: {
    marginTop: verticalScale(20),
    marginHorizontal: scale(20),
    borderRadius: scale(16),
    padding: scale(18),
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: { fontSize: moderateScale(15) },
  detailValue: { fontSize: moderateScale(15), fontWeight: "600" },

  btnWrapper: {
    marginTop: verticalScale(20),
    marginHorizontal: scale(20),
  },
  gradientButton: {
    paddingVertical: verticalScale(14),
    borderRadius: scale(10),
    alignItems: "center",
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#fff",
  },
});
