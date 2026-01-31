import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: { name: string } | null;
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
        // Ensure we hit /auth/login at the root, not /api/auth/login
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const baseUrl = apiUrl.replace(/\/api$/, ''); // Strip trailing /api if present
        window.location.href = `${baseUrl}/auth/login`;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        window.location.href = '/';
    };

    // Simple mock user object based on token presence
    const user = token ? { name: 'MindX Student' } : null;

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
