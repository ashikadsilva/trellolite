import './App.css';
import React, { useContext } from "react";
import { Button, Container, Typography, Card, CardContent, Box } from "@mui/material";
import { AuthContext } from './component/context/AuthProvider';


function App() {
  const { keycloakAuth, authenticated, user } = useContext(AuthContext);

  if (!authenticated) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4">Loading...</Typography>
      </Container>
    );
  }

  const handleLogout = () => {
    keycloakAuth.logout({
      redirectUri: window.location.origin
    });
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8081/auth/hello', {
        headers: {
          'Authorization': `Bearer ${keycloakAuth.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.text();
        alert(`Backend Response: ${data}`);
      } else {
        alert(`Backend Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Backend connection error:', error);
      alert(`Connection Error: ${error.message}`);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🚀 Welcome, {user?.name || "User"}!
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">User Information</Typography>
          <Typography><strong>Name:</strong> {user?.name}</Typography>
          <Typography><strong>Email:</strong> {user?.email}</Typography>
        </CardContent>
      </Card>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={testBackendConnection}
          sx={{ mr: 2 }}>
          Test Connection
        </Button>

        <Button
          variant="outlined"
          onClick={() => window.location.href = '/admin'}
          disabled={!user?.roles?.includes('admin')}
          sx={{ mr: 2 }}>
          Admin Dashboard
        </Button>

        <Button
          variant="outlined"
          onClick={() => window.location.href = '/profile'}
          sx={{ mr: 2 }}>
          Profile
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}

export default App;