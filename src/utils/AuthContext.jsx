import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        // console.log('checkAuth called, token:', token);
        if (token) {
            try {
                const response = await axios.get('/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // console.log('checkAuth success, user:', response.data.user);
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
            // console.log('No token, resetting auth state');
            setUser(null);
            setIsAuthenticated(false);
            return false;
        }
    }, []);

    const login = async (userData) => {
        try {
            const response = await axios.post('/auth/login', userData);
            localStorage.setItem('accessToken', response.data.accessToken);
            // console.log('Login successful, updating auth state');
            await checkAuth();
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = useCallback(async () => {
        // console.log('logout called');
        try {
            // Сбрасываем состояние синхронно
            localStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthenticated(false);
            // Проверяем, что токен удалён
            // console.log('Token removed, isAuthenticated:', isAuthenticated, 'user:', user);  
            // Вызываем checkAuth для дополнительной синхронизации
            await checkAuth();
            // console.log('logout completed');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, []);

    useEffect(() => {
        // console.log('Initial checkAuth on mount');
        checkAuth();
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, checkAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};