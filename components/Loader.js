import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';


export default function Loader() {
const { colors } = useTheme();
return (
<View style={styles.wrap}>
<ActivityIndicator size="large" color={colors.primary} />
</View>
);
}


const styles = StyleSheet.create({
wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});