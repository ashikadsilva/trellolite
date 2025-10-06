import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Card, CardContent, Alert, Button, CircularProgress } from '@mui/material';
import api from '../services/api';
import { getErrorMessage, showToast } from '../../utils/toast';

const AdminPage = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current) return; // skip second StrictMode run
    effectRan.current = true;

    const fetchAdminData = async () => {
      try {
        const response = await api.get("/auth/admin/dashboard");
        setAdminData(response.data);
        showToast.success('Admin Dashboard loaded!');
      } catch (err) {
        console.error("Error fetching admin data:", err);
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        showToast.error(errorMsg);
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
            <Card sx= {{ mt:2 }}>
                <CardContent>
                <Typography><strong>User:</strong> {adminData?.username}</Typography>
                <Typography><strong>Message:</strong> {adminData.message}</Typography>
            </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Button variant="contained" sx={{ mt: 2, mr:2, borderRadius: 0 }} onClick={() => window.location.href = '/'}>
        Back to Home
      </Button>
    </Container>
  );
};

export default AdminPage;