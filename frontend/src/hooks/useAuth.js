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
                
                // AQUI ESTÁ A MUDANÇA:
                // Ao invés de jogar um erro, nós apenas verificamos.
                if (decoded.exp < currentTime) {
                    // O token expirou. Apenas limpamos os dados silenciosamente ou mostramos um log simples.
                    console.log("Sessão expirada. Faça login novamente."); 
                    
                    Cookies.remove('token', { path: '/' }); 
                    setUserRole(null);
                    setUserStatus(null);
                    setIsAuthenticated(false);
                } else {
                    // Token ainda é válido
                    setUserRole(decoded.role);
                    setUserStatus(decoded.status);
                    setIsAuthenticated(true);
                }

            } catch (error) {
                // Este catch agora só pega erros se o token for inválido (formato errado), não por tempo.
                // Removi o console.error para ficar mais limpo, se preferir pode usar console.warn
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