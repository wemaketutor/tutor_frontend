import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from './axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await api.get('/profile');
                setUser(response.data.user);
                setIsAuthenticated(true);
                return true;
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
                setIsAuthenticated(false);
                return false;
            }
        } else {
            setUser(null);
            setIsAuthenticated(false);
            return false;
        }
    }, []);

    const login = async (userData) => {
        try {
            const response = await api.post('/auth/login', userData);
            localStorage.setItem('accessToken', response.data.accessToken);
            await checkAuth();
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                await api.post('/auth/logout');
            }
            localStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, checkAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};