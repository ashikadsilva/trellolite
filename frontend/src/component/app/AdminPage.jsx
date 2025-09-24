import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Alert, Button, CircularProgress } from '@mui/material';
import api from '../services/api';

const AdminPage = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get("/auth/admin/dashboard");
        setAdminData(response.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(err.response?.data?.message || "Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading admin dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Welcome, Admin!</Typography>
          <Typography>Only users with the 'admin' role can see this page.</Typography>
          {adminData && (
            <Typography sx={{ mt: 2 }}>
              <strong>Backend Response:</strong> {adminData}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Button variant="contained" onClick={() => window.location.href = '/'}>
        Back to Home
      </Button>
    </Container>
  );
};

export default AdminPage;