import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            const user = JSON.parse(userData);
            // In a real app, you'd decode a JWT. Here, we parse it from the dummy token.
            const role = token.includes('Manager') ? 'Manager' : 'Employee';
            setUser({ ...user, role });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.login({ email, password });
            const { token, role, user: userData } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ ...userData, role }));
            setUser({ ...userData, role });
            return { role };
        } catch (error) {
            console.error("Login failed:", error);
            return { error: true };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}; 