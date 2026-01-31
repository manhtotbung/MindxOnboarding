import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));

    useEffect(() => {
        // Check for token in URL query params (callback from backend)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');

        if (urlToken) {
            console.log('Token received from callback!');
            setToken(urlToken);
            localStorage.setItem('access_token', urlToken);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const login = () => {
        // Redirect to Backend Login Endpoint (Local: Port 3000)
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        window.location.href = `${apiUrl}/api/auth/login`;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
