import React, { useState, useEffect, useRef, createContext } from "react";
import { CircularProgress, Box } from "@mui/material";
import keycloakAuth from "../keycloak/keycloakAuth";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    const initKeycloak = async () => {
      if (isInitializing.current) return;

      isInitializing.current = true;

      try {
        const auth = await keycloakAuth.init({
          onLoad: "login-required",
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          checkLoginIframe: false //Disable iframe check for simpler setup
        });
        setAuthenticated(auth);

        if (auth && keycloakAuth.tokenParsed) {
          // Decode user info
          const tokenParsed = keycloakAuth.tokenParsed;
          setUser({
            id: tokenParsed?.sub,
            name: tokenParsed?.name || tokenParsed?.preferred_username,
            email: tokenParsed?.email,
            roles: tokenParsed?.realm_access?.roles || [],
          });

          // Token refresh interval
          const interval = setInterval(async () => {
            try {
              await keycloakAuth.updateToken(30); // refresh if less than 30s left
            } catch (error) {
              console.error("Failed to refresh token:", error);
              keycloakAuth.logout();
            }
          }, 20 * 1000); // check every 20s

          // Cleanup function
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error("Keycloak init error:", error);
        setAuthenticated(false);
      } finally {
        setIsLoading(false);
        // isInitializing.current = false;
      }
    };

    initKeycloak();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ keycloakAuth, authenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;