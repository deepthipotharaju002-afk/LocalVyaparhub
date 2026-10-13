import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public/api";

async function apiPost(url, body = {}) {
  try {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(BASE_URL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    console.log("RAW API RESPONSE:", text); // remove later

    if (text.startsWith("<")) {
      throw new Error("Server returned HTML instead of JSON");
    }

    return JSON.parse(text);
  } catch (err) {
    Alert.alert("API Error", err.message);
    throw err;
  }
}

//RAZORPAY_KEY=rzp_live_RkQjPLoZl487bM
//RAZORPAY_SECRET=fNb7FIm7A70JFSY83H1YmAPo
export default function PaymentScreen() {
  const navigation = useNavigation();
  const [orderHtml, setOrderHtml] = useState(null);
  const webviewRef = useRef(null);

  useEffect(() => {
    initPayment();
  }, []);

 const initPayment = async () => {
  try {
    const userId = await AsyncStorage.getItem("user_id");
    const token = await AsyncStorage.getItem("token");

    if (!userId || !token) {
      Alert.alert("Auth Error", "Please login again");
      navigation.replace("AuthChoice");
      return;
    }

    const res = await apiPost("/payment/create-order", {
      user_id: userId,
    });

    if (!res.status || !res.order) {
      Alert.alert("Payment Error", res.message || "Unable to create order");
      navigation.goBack();
      return;
    }

    const order = res.order;

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Razorpay Payment</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </head>
  <body>
    <script>
      window.onload = function () {
        var options = {
          key: "${res.razorpay_key}",
          amount: ${order.amount},
          currency: "INR",
          name: "Local Vyapar Hub",
          description: "Business Registration Fee",
          order_id: "${order.id}",

          handler: function (response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              status: "success",
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }));
          },

          modal: {
            ondismiss: function () {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                status: "cancelled"
              }));
            }
          },

          theme: {
            color: "#3399cc"
          }
        };

        var rzp = new Razorpay(options);
        rzp.open();
      };
    </script>
  </body>
</html>`;

    setOrderHtml(html);
  } catch (err) {
    Alert.alert("Payment Error", err.message);
  }
};


 const handleMessage = async (event) => {
  try {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.status === "cancelled") {
      Alert.alert("Payment Cancelled");
      navigation.goBack();
      return;
    }

    const userId = await AsyncStorage.getItem("user_id");

    const verify = await apiPost("/payment/verify", {
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_order_id: data.razorpay_order_id,
      razorpay_signature: data.razorpay_signature,
      user_id: userId,
    });

    if (verify.status) {
      await AsyncStorage.setItem("payment_status", "1");
      navigation.replace("AddBusinessDetailsScreen");
    }else {
      Alert.alert("Payment Failed", verify.message || "Verification failed");
    }
  } catch (err) {
    Alert.alert("Payment Error", err.message);
  }
};

  if (!orderHtml) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Preparing Payment...</Text>
        <ActivityIndicator size="large" color="#3399cc" />
      </View>
    );
  }

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={["*"]}
      source={{ html: orderHtml }}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
      mixedContentMode="always"
      allowsInlineMediaPlayback
      style={{ flex: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
});
