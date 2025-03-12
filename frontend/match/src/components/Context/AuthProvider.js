import React, { createContext, useEffect, useState } from "react";
const baseUrl = process.env.REACT_APP_API_BASE_URL;


export const AuthContext = createContext(null);

function AuthProvider({children}) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${baseUrl}auth/check`, {
                    credentials: 'include'
                })
                if (!response.ok) {
                    throw new Error('Not logged in')
                }
                const userData = await response.json()
                userData.id = userData.id.toString();
                setUser(userData);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        void checkAuth()
    }, []);
    return (
        <AuthContext.Provider value={{ user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
