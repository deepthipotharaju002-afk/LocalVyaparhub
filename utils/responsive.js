import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// Base design size (e.g., iPhone X)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// ✨ Scale horizontally
export const wp = (percentage) => {
  const value = (percentage * width) / 100;
  return Math.round(value);
};

// ✨ Scale vertically
export const hp = (percentage) => {
  const value = (percentage * height) / 100;
  return Math.round(value);
};

// ✨ Scale value based on screen width
export const scale = (size) => (width / guidelineBaseWidth) * size;

// ✨ Scale value based on screen height
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;

// ✨ Moderate scaling (useful for padding/margins)
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// ✨ Responsive font size
export const rf = (fontSize) => {
  const newSize = scale(fontSize);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// ✅ Optional alias for clarity
export const fontSize = rf;

// Export screen dimensions
export const deviceWidth = width;
export const deviceHeight = height;
