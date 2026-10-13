import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RegistrationScreen from "../screens/RegisterScreen";
import PaymentPreviewScreen from "../screens/PaymentPreviewScreen";
import PaymentScreen from "../screens/PaymentScreen";
import AddBusinessDetailsScreen from "../screens/AddBusinessDetailsScreen";

const Stack = createNativeStackNavigator();

export default function AddStack() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      const name = await AsyncStorage.getItem("name");
      const email = await AsyncStorage.getItem("email");
      const mobile = await AsyncStorage.getItem("mobile");
      const paymentStatus = await AsyncStorage.getItem("payment_status");

      const isProfileComplete =
        name?.trim() && email?.trim() && mobile?.trim();

      if (!isProfileComplete) {
        setInitialRoute("Registration");
        return;
      }

      const paymentDone =
        paymentStatus === "1" || paymentStatus === "true";

      if (!paymentDone) {
        setInitialRoute("PaymentPreview");
        return;
      }

      setInitialRoute("AddBusinessDetailsScreen");
    };

    checkStatus();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="PaymentPreview" component={PaymentPreviewScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen
        name="AddBusinessDetailsScreen"
        component={AddBusinessDetailsScreen}
      />
    </Stack.Navigator>
  );
}
