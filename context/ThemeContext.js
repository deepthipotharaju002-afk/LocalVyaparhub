import React, { createContext, useState, useContext, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === "dark");
  const [isLoaded, setIsLoaded] = useState(false);

  // 🔹 Load stored theme from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeMode");
        if (savedTheme !== null) {
          setIsDark(savedTheme === "dark");
        } else {
          // Default to system theme if no preference saved
          setIsDark(systemScheme === "dark");
        }
      } catch (e) {
        console.log("Failed to load theme:", e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // 🔹 Save theme whenever it changes
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem("themeMode", isDark ? "dark" : "light");
    }
  }, [isDark, isLoaded]);

  // 🔹 Optional: Auto-update with system changes
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem("themeMode").then((stored) => {
        // only update from system if user hasn’t manually set theme
        if (!stored) setIsDark(colorScheme === "dark");
      });
    });
    return () => listener.remove();
  }, []);

  const colors = {
    background: isDark ? "#121212" : "#FFFFFF",
    text: isDark ? "#EDEDED" : "#222222",
    card: isDark ? "#1E1E1E" : "#F8F8F8",
    primary: "#ED208E",
    secondary: "#0CB2E5",
    icon: isDark ? "#EDEDED" : "#333333",
    gradient: isDark ? ["#D21C7D", "#0A9BD1"] : ["#D21C7D", "#0A9BD1"],
  };

  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    await AsyncStorage.setItem("themeMode", newMode ? "dark" : "light");
  };

  const theme = { isDark, colors, toggleTheme };

  if (!isLoaded) return null; // or a splash screen while loading

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
