import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://localvyaparhub.com/LocalVyaparHub/public/api/v1/auth";

// ------------------- SEND OTP -------------------
export const sendOtp = async (phone) => {
  try {
    const res = await fetch(`${BASE_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to send OTP");

    // DEV MODE: log OTP for testing
    if (data.test && data.otp) {
      console.log("🚀 Test OTP (dev mode):", data.otp);
      alert(`Test OTP: ${data.otp}`); // optional, shows OTP in app
    }

    return data;
  } catch (err) {
    console.error("sendOtp error:", err);
    throw err;
  }
};

// ------------------- VERIFY OTP -------------------
export const verifyOtp = async (phone, otp) => {
  try {
    const res = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Invalid OTP");

    // Save token & user locally
    if (data.token) {
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (err) {
    console.error("verifyOtp error:", err);
    throw err;
  }
};
