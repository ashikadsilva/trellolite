import './App.css';
import React, { useContext, useState } from "react";
import { Button, Container, Typography, Card, CardContent, Box, CircularProgress, Grid } from "@mui/material";
import { AuthContext } from './component/context/AuthProvider';
import { getErrorMessage, showToast } from './utils/toast';
import Header from './component/Header';


function App() {
  const { keycloakAuth, authenticated, user } = useContext(AuthContext);
  const [testing, setTesting] = useState(false);

  if (!authenticated) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4">Loading...</Typography>
      </Container>
    );
  }

  const testBackendConnection = async () => {
    setTesting(500)
    try {
      const response = await fetch('http://localhost:8081/auth/hello', {
        headers: {
          'Authorization': `Bearer ${keycloakAuth.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.text();
        showToast.success(`Response: ${data}`);
      } else {
        showToast.error(`Backend Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Backend connection error:', error);
      showToast.error(getErrorMessage(error));
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <Header />
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

        {/* Box wrapping buttons must be closed */}
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
        </Box>
      </Container>
    </>
  );
}

export default App;