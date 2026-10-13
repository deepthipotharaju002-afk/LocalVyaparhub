import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';


export default function TextField({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry }) {
const { colors } = useTheme();
return (
<View style={{ marginBottom: 12 }}>
{label ? <Text style={[styles.label, { color: colors.muted }]}>{label}</Text> : null}
<TextInput
value={value}
onChangeText={onChangeText}
placeholder={placeholder}
placeholderTextColor={colors.muted}
keyboardType={keyboardType}
secureTextEntry={secureTextEntry}
style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
/>
</View>
);
}


const styles = StyleSheet.create({
label: { marginBottom: 6, fontSize: 13 },
input: {
height: 48,
borderRadius: 10,
paddingHorizontal: 12,
borderWidth: 1,
fontSize: 15,
},
});