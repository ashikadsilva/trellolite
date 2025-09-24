import keycloakAuth from "../keycloak/keycloakAuth";


const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8081",
    headers: {
        "Content-Type": "application/json"
    },
});

// Add request interceptor to attach token
api.interceptors.request.use(
    async (config) => {
        if (keycloakAuth && keycloakAuth.authenticated) {
            try {
                // Refresh token if needed
                await keycloakAuth.updateToken(30); //refresh if expiring within 30s
                config.headers.Authorization = `Bearer ${keycloakAuth.token}`;
            } catch (err) {
                console.error("Failed to refresh token:", err);
                keycloakAuth.logout();
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;