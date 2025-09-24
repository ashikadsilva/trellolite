import React, { useState, useEffect, useRef } from "react";
import { CircularProgress, Box } from "@mui/material";
import keycloakAuth from "../keycloak/keycloakAuth";

export const AuthContext = React.createContext();

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
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        });

        setAuthenticated(auth);

        if (auth && keycloakAuth.token) {
          // Decode user info
          const tokenParsed = keycloakAuth.tokenParsed;
          setUser({
            name: tokenParsed?.name,
            email: tokenParsed?.email,
            roles: tokenParsed?.realm_access?.roles || [],
          });

          // Token refresh interval
          const interval = setInterval(async () => {
            const refreshed = await keycloakAuth.updateToken(30)  // refresh if less than 30s left
            if(refreshed)
              console.log("Token refreshed", keycloakAuth.tokenParsed);
          }, 20 * 1000); //check every 20s

          return() => clearInterval(interval);
        }
      }catch (error){
        console.error("Keycloak init error:", error);
        isInitializing.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();
  }, []);

  if(isLoading) {
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