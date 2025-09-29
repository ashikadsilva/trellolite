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

const handleLogout = () => {
  showToast.info('Logging out...');
  setTimeout (() => {
    keycloakAuth.logout({
      redirectUri: window.location.origin
    });
  }, 500);
};

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
    <Header/>
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🚀 Welcome, {user?.name || "User"}!
      </Typography>

      <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>User Information</Typography>
                <Typography><strong>Name:</strong> {user?.name}</Typography>
                <Typography><strong>Email:</strong> {user?.email}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2,  }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={testBackendConnection}
                    disabled={testing}
                    fullWidth
                    sx={{ borderRadius: 0 }} >
                    {testing ? <CircularProgress size={24} /> : 'Test Backend Connection'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;