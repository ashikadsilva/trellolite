import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthProvider';
import api from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Try different endpoints based on user roles
        let endpoint = "/auth/hello"; // default endpoint
        
        if (user?.roles?.includes('admin')) {
          endpoint = "/auth/admin/dashboard";
        } else if (user?.roles?.includes('user')) {
          endpoint = "/auth/user/profile";
        }

        const response = await api.get(endpoint);
        setProfile({
          message: response.data,
          name: user?.name,
          email: user?.email,
          roles: user?.roles
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          <strong>Error:</strong> {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>User Profile</Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6">Profile Information</Typography>
          <Typography><strong>Name:</strong> {profile?.name || 'N/A'}</Typography>
          <Typography><strong>Email:</strong> {profile?.email || 'N/A'}</Typography>
          <Typography><strong>Roles:</strong> {profile?.roles?.join(', ') || 'N/A'}</Typography>
          {profile?.message && (
            <Typography sx={{ mt: 2 }}>
              <strong>Backend Message:</strong> {profile.message}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;