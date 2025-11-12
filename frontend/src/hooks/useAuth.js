/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export function useAuth() {
    const [userRole, setUserRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        const token = Cookies.get('token');
        console.log("Token encontrado no cookie:", !!token);

        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Role decodificada:", decoded.role);
                setUserRole(decoded.role);
                setIsAuthenticated(true);

            } catch (error) {
                console.error("Token falhou na decodificação ou expiração:", error);
                Cookies.remove('token'); 
                setUserRole(null);
                setIsAuthenticated(false);
            }
        } else {
            setUserRole(null);
            setIsAuthenticated(false);
        }
    }, []);

    const loginSuccess = (token) => {
        const decoded = jwtDecode(token)
        setUserRole(decoded.role)
        setIsAuthenticated(true)
    };

    return { userRole, isAuthenticated, loginSuccess }
}
