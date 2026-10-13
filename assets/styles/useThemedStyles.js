import { StyleSheet } from "react-native";
import { responsiveWidth as rw, responsiveHeight as rh } from "react-native-responsive-dimensions";
import { useTheme } from "../context/ThemeContext";

export default function useThemedStyles() {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: rw(5),
      paddingVertical: rh(2),
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
    },
    title: {
      fontSize: rw(6),
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: rh(2),
    },
    input: {
      backgroundColor: colors.card,
      color: colors.text,
      borderRadius: 12,
      padding: rw(4),
      marginTop: rh(1.5),
      fontSize: rw(4),
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: rh(2),
      marginTop: rh(3),
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: rw(4.2),
    },
    imagePreview: {
      width: rw(40),
      height: rw(40),
      borderRadius: rw(20),
      alignSelf: "center",
      marginTop: rh(2),
    },
    cameraButton: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingVertical: rh(1.5),
      marginTop: rh(2),
      alignItems: "center",
    },
    cameraButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: rw(4),
    },
    textCenter: {
      textAlign: "center",
      color: colors.text,
      marginTop: rh(1),
      fontSize: rw(3.8),
    },
  });
}
