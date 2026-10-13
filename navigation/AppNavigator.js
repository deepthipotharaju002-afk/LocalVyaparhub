import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import AllListingsScreen from '../screens/AllListingsScreen';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';


const Stack = createNativeStackNavigator();


function RootNavigator() {
const { user, loading } = useAuth();


if (loading) return null; // or a splash


return (
<NavigationContainer>
<Stack.Navigator screenOptions={{ headerShown: false }}>
{user ? (
// logged in
<Stack.Screen name="Main" component={AllListingsScreen} />
) : (
// auth flow
<Stack.Screen name="Auth" component={AuthNavigator} />
)}
</Stack.Navigator>
</NavigationContainer>
);
}


export default function AppNavigator() {
return (
<ThemeProvider>
<AuthProvider>
<RootNavigator />
</AuthProvider>
</ThemeProvider>
);
}