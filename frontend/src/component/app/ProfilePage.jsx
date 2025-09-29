import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Alert, TextField, Button } from '@mui/material';
import { AuthContext } from '../context/AuthProvider';
import api from '../services/api';
import { getErrorMessage, showToast } from '../../utils/toast';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [saving, setSaving] = useState(false);

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
                showToast.success("Profile loaded Successfully");

            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.response?.data?.message || err.message || "Failed to fetch profile");
                const errorMsg = getErrorMessage(err);
                setError(errorMsg);
                showToast.error(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleUpdate = async () => {

        // Validation
        if (!firstName.trim() || !lastName.trim() || !fullName.trim()) {
            showToast.warning("Please fill in all fields");
            return;
        }
        setSaving(true);

        try {
            const response = await api.put("/auth/user/profile", {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                fullName: fullName.trim()
            });
            const data = response.data;

            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");
            setProfile(data); // store full response for message/email
            setEditMode(false);

            showToast.success("Profile updated Successfully!")
        } catch (err) {
            console.error("Error updating profile:", err);
            const errorMsg = getErrorMessage(err);
            setError(errorMsg);
            showToast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFirstName(profile.firstName || '');
        setLastName(profile.lastName || '');
        setFullName(profile.fullName || '');
        setEditMode(false);
        showToast.info('Changes cancelled');
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

    if (error && !profile) return (
        <Container sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
            <Button
                variant='contained'
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}>
                Retry
            </Button>
        </Container>
    )

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
                                required
                                disabled={saving}
                            />
                            <TextField
                                label="Last Name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                                required
                                disabled={saving}
                            />
                            <TextField
                                label="Full Name"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                                required
                                disabled={saving}
                            />
                            <Button variant="contained" onClick={handleUpdate} sx={{ mr: 1 }} disabled={saving}>
                                {saving ? <CircularProgress size={24} /> : 'Save'}
                            </Button>
                            <Button variant="outlined" onClick={handleCancel}
                                disabled={saving}>Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Typography><strong>Full Name:</strong>{fullName}</Typography>
                            <Typography><strong>First Name:</strong> {firstName}</Typography>
                            <Typography><strong>Last Name:</strong> {lastName}</Typography>
                            <Typography><strong>Email:</strong> {profile.email}</Typography>
                            {profile.message && <Typography sx={{ mt: 2 }}><strong>Message:</strong> {profile.message}</Typography>}

                            <Button variant="contained" sx={{ mt: 2, mr:2, borderRadius: 0 }} onClick={() => setEditMode(true)}>Edit Profile</Button>
                            <Button variant="contained" sx={{ mt: 2, borderRadius:0 }} onClick={() => window.location.href = '/' }>Back to Home</Button>

                        </>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProfilePage;