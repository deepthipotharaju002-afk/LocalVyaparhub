import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';


const Stack = createNativeStackNavigator();


export default function AuthNavigator() {
return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="Otp" component={OtpScreen} />
</Stack.Navigator>
);
}