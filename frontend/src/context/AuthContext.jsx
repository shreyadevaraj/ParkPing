import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ authenticated: true });
        }
        setLoading(false);
    }, []);

    const sendLoginOtp = async (phoneNumber) => {
        await api.post('/auth/send-otp', { phoneNumber, isLogin: true });
    };

    const sendSignupOtp = async (phoneNumber) => {
        await api.post('/auth/send-otp', { phoneNumber, isLogin: false });
    };

    const login = async (phoneNumber, otp) => {
        const res = await api.post('/auth/login', { phoneNumber, otp });
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            setUser({ authenticated: true });
        }
    };

    const register = async (name, phoneNumber, otp, vehicleName, vehicleType) => {
        const res = await api.post('/auth/register', { name, phoneNumber, otp, vehicleName, vehicleType });
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            setUser({ authenticated: true });
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Ignore logout errors
        }
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, sendLoginOtp, sendSignupOtp, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
