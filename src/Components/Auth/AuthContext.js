import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await axiosInstance.get('/api/user/');
                    setCurrentUser(response.data);
                    setUserLoggedIn(true);
                } catch (error) {
                    console.error("Error fetching user details:", error);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    setCurrentUser(null);
                    setUserLoggedIn(false);
                }
            } else {
                setCurrentUser(null);
                setUserLoggedIn(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, [userLoggedIn]);

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/api/login/', { email, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            const userResponse = await axiosInstance.get('/api/user/');
            setCurrentUser(userResponse.data);
            setUserLoggedIn(true);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setCurrentUser(null);
        setUserLoggedIn(false);
    };

    const value = {
        currentUser,
        userLoggedIn,
        loading,
        login,
        logout,
        setUserLoggedIn,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
    
};
