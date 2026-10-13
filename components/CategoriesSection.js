import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { hp, wp, rf } from "../utils/responsive";

export default function CategoriesSection({
  data = [],
  loading = false,
}) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Popular Categories
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: wp(2) }}
        >
          {data.map((cat) => {
            const iconName = (cat.icon || "apps").trim();
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.item}
                onPress={() =>
                  navigation.navigate("CategoryListings", {
                    categoryId: cat.id,
                    categoryName: cat.name,
                  })
                }
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.circle}
                >
                  <Ionicons name={iconName} size={rf(20)} color="#fff" />
                </LinearGradient>

                <Text
                  style={[styles.text, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
  },
  title: {
    fontSize: rf(18),
    fontWeight: "700",
    marginLeft: wp(2),
    marginBottom: hp(1),
  },
  item: {
    alignItems: "center",
    marginRight: wp(4),
    width: wp(18),
  },
  circle: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(0.5),
  },
  text: {
    fontSize: rf(11),
    fontWeight: "600",
    textAlign: "center",
  },
});
