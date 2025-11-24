import { useState, useEffect, useCallback } from "react";
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export function useAuth() {
    const [userRole, setUserRole] = useState(null);
    const [userStatus, setUserStatus] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const checkAuthStatus = useCallback(() => {
        const token = Cookies.get('token');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                
                if (decoded.exp < currentTime) {
                    throw new Error("Token expirado.");
                }
                
                setUserRole(decoded.role);
                setUserStatus(decoded.status);
                setIsAuthenticated(true);

            } catch (error) {
                console.error("Auth Error:", error);
                Cookies.remove('token', { path: '/' }); 
                setUserRole(null);
                setUserStatus(null);
                setIsAuthenticated(false);
            }
        } else {
            setUserRole(null);
            setUserStatus(null);
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const loginSuccess = (token) => {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setUserStatus(decoded.status);
        setIsAuthenticated(true);
    };

    return { userRole, userStatus, isAuthenticated, loginSuccess }
}