

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe as apiGetMe, logout as apiLogout } from '../utils/authApi';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [token, setToken] = useState(null);
const [loading, setLoading] = useState(true);


useEffect(() => {
(async () => {
try {
const t = await AsyncStorage.getItem('token');
const u = await AsyncStorage.getItem('user');
if (t) setToken(t);
if (u) setUser(JSON.parse(u));


// Optionally verify token via /me
if (t) {
const me = await apiGetMe();
setUser(me);
await AsyncStorage.setItem('user', JSON.stringify(me));
}
} catch (e) {
// ignore
} finally {
setLoading(false);
}
})();
}, []);


const signIn = async ({ token: t, user: u }) => {
setToken(t);
setUser(u);
await AsyncStorage.setItem('token', t);
await AsyncStorage.setItem('user', JSON.stringify(u));
};


const signOut = async () => {
try {
await apiLogout();
} catch (e) {
// ignore
}
setToken(null);
setUser(null);
await AsyncStorage.removeItem('token');
await AsyncStorage.removeItem('user');
};


return (
<AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
{children}
</AuthContext.Provider>
);
};


export const useAuth = () => useContext(AuthContext);