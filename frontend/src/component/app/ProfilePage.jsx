import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Alert, TextField, Button } from '@mui/material';
import { AuthContext } from '../context/AuthProvider';
import api from '../services/api';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const { user } = useContext(AuthContext);
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;

        const fetchProfile = async () => {
            try {
                const response = await api.get("/auth/user/profile-info");
                setProfile(response.data);
                setFullName(response.data.fullName || '');
                setFirstName(response.data.firstName || '');
                setLastName(response.data.lastName || '');

            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.response?.data?.message || err.message || "Failed to fetch profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleUpdate = async () => {
        try {
            const response = await api.put("/auth/user/profile", { firstName, lastName, fullName });
            const data = response.data;

            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");
            setProfile(data); // store full response for message/email
            setEditMode(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.response?.data?.message || err.message || "Update failed");
        }
    };


    if (loading) return (
        <Container sx={{ mt: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
        </Container>
    );

    if (error) return (
        <Container sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    );

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>User Profile</Typography>
            <Card>
                <CardContent>
                    {editMode ? (
                        <>
                            <TextField
                                label="First Name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Last Name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Full Name"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <Button variant="contained" onClick={handleUpdate} sx={{ mr: 1 }}>Save</Button>
                            <Button variant="outlined" onClick={() => setEditMode(false)}>Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Typography><strong>Full Name:</strong>{fullName}</Typography>
                            <Typography><strong>First Name:</strong> {firstName}</Typography>
                            <Typography><strong>Last Name:</strong> {lastName}</Typography>
                            <Typography><strong>Email:</strong> {profile.email}</Typography>
                            {profile.message && <Typography sx={{ mt: 2 }}><strong>Message:</strong> {profile.message}</Typography>}

                            <Button variant="contained" sx={{ mt: 2 }} onClick={() => setEditMode(true)}>Edit Profile</Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProfilePage;
