"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchAPI } from "@/lib/strapi";

interface User {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    purchased_clases?: {
        id: number;
        titulo: string;
        slug: string;
    }[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = Cookies.get("token");
            if (token) {
                try {
                    const data = await fetchAPI("/users/me", {
                        populate: {
                            purchased_clases: {
                                populate: ["thumbnail"]
                            }
                        }
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (data) {
                        setUser(data);
                    } else {
                        Cookies.remove("token");
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error checking auth status:", error);
                    Cookies.remove("token");
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (identifier: string, password: string) => {
        const data = await fetchAPI("/auth/local", {}, {
            method: "POST",
            body: JSON.stringify({ identifier, password }),
        });

        if (data.jwt) {
            Cookies.set("token", data.jwt, { expires: 7 }); // 7 days
            setUser(data.user);
        } else {
            throw new Error(data.error?.message || "Error al iniciar sesión");
        }
    };

    const register = async (username: string, email: string, password: string) => {
        const data = await fetchAPI("/auth/local/register", {}, {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
        });

        if (data.jwt) {
            Cookies.set("token", data.jwt, { expires: 7 });
            setUser(data.user);
        } else {
            throw new Error(data.error?.message || "Error al registrarse");
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        window.location.href = "/"; // Redirect to home
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
