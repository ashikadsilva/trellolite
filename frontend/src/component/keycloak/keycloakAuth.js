import Keycloak from "keycloak-js";

const keycloakAuth = new Keycloak({
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
  backendURL: process.env.REACT_APP_BACKEND_URL
});

export default keycloakAuth;
