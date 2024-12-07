'use client';

import { ObjectId } from 'mongoose';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    _id: ObjectId;
    name?: string;
    email?: string;
    avatar?: string;
    bannerImage?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${
                            document.cookie
                                .split('; ')
                                .find((row) => row.startsWith('token='))
                                ?.split('=')[1]
                        }`,
                    },
                });

                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to check authentication:', error);
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
