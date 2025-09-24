import './App.css';

import { useContext } from "react";
import { Button, Container, Typography, Card, CardContent } from "@mui/material";
import { AuthContext } from './component/context/AuthProvider';


function App() {
  const { keycloakAuth, authenticated, user } = useContext(AuthContext);

  if (!authenticated) 
    return <h2>Loading...</h2>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🚀 Welcome, {user?.name || "User"}!
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Email</Typography>
          <Typography> {user?.email} </Typography>        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => keycloakAuth.logout()} >
        Logout
      </Button>
    </Container>
  );
}

export default App;
