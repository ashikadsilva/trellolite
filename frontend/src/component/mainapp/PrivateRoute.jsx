import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import { AuthContext } from "../context/AuthProvider";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { authenticated, user } = useContext(AuthContext);

  if (!authenticated)
    return <Navigate to="/" replace />;

  // if allowedRoles is empty, allow all authenticated users
  if (allowedRoles.length === 0)
    return children;

  const hasRole = user?.roles?.some(role => allowedRoles.includes(role));

  if (!hasRole) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You don't have permission to access this page.
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Required roles: {allowedRoles.join(', ')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 4 }}>
          Your roles: {user?.roles?.join(', ') || 'None'}
        </Typography>
        <Button variant="contained" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
      </Container>
    );
  }
  return children;
}

export default PrivateRoute;