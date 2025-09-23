import logo from './logo.svg';
import './App.css';

import React, { useContext } from "react";
import { Button, Container, Typography, Card, CardContent } from "@mui/material";
import { AuthContext } from './component/authentication/AuthProvider';


function App() {
  const { keycloakAuth, authenticated } = useContext(AuthContext);

  if (!authenticated) return <h2>Loading...</h2>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🚀 My Freelancer Portfolio
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">About Me</Typography>
          <Typography>I am a full-stack developer skilled in Java, React, AWS.</Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Projects</Typography>
          <Typography>- Employee Management System</Typography>
          <Typography>- Spotify Song Retrieval API</Typography>
          <Typography>- Switch: PWA Project</Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => keycloakAuth.logout()}
      >
        Logout
      </Button>
    </Container>
  );
}

export default App;
