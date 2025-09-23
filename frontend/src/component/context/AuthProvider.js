import React, { useState, useEffect, useRef } from "react";
import { CircularProgress, Box } from "@mui/material";
import keycloakAuth from "../keycloak/keycloakAuth";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInitializing = useRef(false);

  useEffect(() => {
    const initKeycloak = async () => {
      if (isInitializing.current) return;
      
      isInitializing.current = true;
      try {
        const auth = await keycloakAuth.init({
          onLoad: "login-required",
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        });
        setAuthenticated(auth);
        if (auth && keycloakAuth.token) {
          const response = await fetch("http://localhost:8080/protected", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${keycloakAuth.token}`,
            },
          });
          const data = await response.json();
          console.log(data);
        }
      } catch (error) {
        console.error("Keycloak init error:", error);
        isInitializing.current = false;
      } finally {
        setIsLoading(false);
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
    <AuthContext.Provider value={{ keycloakAuth, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;