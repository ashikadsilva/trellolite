import keycloakAuth from "../keycloak/keycloakAuth";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8081",
    headers: {
        "Content-Type": "application/json"
    },
});

// Add request interceptor to attach token
api.interceptors.request.use(
    api.interceptors.request.use(async (config) => {
        if(keycloakAuth?.authenticated) {
            try {
                await keycloakAuth.updateToken(30);
                config.headers.Authorization = `Bearer ${keycloakAuth.token}`;
            } catch {
                keycloakAuth.logout({ redirectUri: window.location.origin });
            }
        }
        return config;
    }),
    (error) => Promise.reject(error)
);

export default api;