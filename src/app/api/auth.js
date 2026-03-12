// import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.254.119:8000/api';

function getApiErrorMessage(data, fallback) {
    if (!data) return fallback;

    if (typeof data === 'string') return data;
    if (typeof data.message === 'string' && data.message.trim()) return data.message;

    if (typeof data.detail === 'string' && data.detail.trim()) return data.detail;
    if (typeof data['hydra:description'] === 'string' && data['hydra:description'].trim()) {
        return data['hydra:description'];
    }

    if (Array.isArray(data.violations) && data.violations.length > 0) {
        const first = data.violations[0];
        if (first?.message) return first.message;
    }

    return fallback;
}

async function safeJson(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function safeSetItem(key, value) {
    try {
        if (!AsyncStorage || typeof AsyncStorage.setItem !== 'function') return;
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.warn('AsyncStorage setItem failed:', e?.message || e);
    }
}

async function safeGetItem(key) {
    try {
        if (!AsyncStorage || typeof AsyncStorage.getItem !== 'function') return null;
        return await AsyncStorage.getItem(key);
    } catch (e) {
        console.warn('AsyncStorage getItem failed:', e?.message || e);
        return null;
    }
}

async function safeRemoveItem(key) {
    try {
        if (!AsyncStorage || typeof AsyncStorage.removeItem !== 'function') return;
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.warn('AsyncStorage removeItem failed:', e?.message || e);
    }
}

export async function login(username, password) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await safeJson(response);

    if (!response.ok) {
        throw new Error(getApiErrorMessage(data, 'Login failed'));
    }

    if (data.token) {
        await safeSetItem('authToken', data.token);
    } 

    return data;
}

export async function register(username, email, password, name, phone, age, accountNumber) {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, name, phone, age, accountNumber }),
    });

    const data = await safeJson(response);

    if (!response.ok) {
        throw new Error(getApiErrorMessage(data, 'Registration failed'));
    }

    return data;
}

export async function getAuthToken() {
    return await safeGetItem('authToken');
}

export async function logout() {
    await safeRemoveItem('authToken');
}
