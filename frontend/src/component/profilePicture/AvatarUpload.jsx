import React, { useRef, useState } from 'react'
import { showToast } from '../../utils/toast';
import { Box, Button, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import api from '../services/api'
import UserAvatar from './UserAvatar';

const AvatarUpload = ({ user, onAvatarUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      showToast.error('Image size must be less than 2MB');
      return;
    }

    // Convert to base64 and upload
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      await uploadAvatar(base64String);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async (base64String) => {
    setUploading(true);
    try {
      const response = await api.post('/auth/user/avatar', {
        avatar: base64String
      });
      
      showToast.success('Avatar uploaded successfully! 🎉');
      onAvatarUpdate(response.data.avatar);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showToast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setUploading(true);
    try {
      await api.delete('/auth/user/avatar');
      showToast.success('Avatar deleted successfully');
      onAvatarUpdate(null);
      setPreviewOpen(false);
    } catch (error) {
      console.error('Error deleting avatar:', error);
      showToast.error('Failed to delete avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <UserAvatar 
            user={user} 
            size={120} 
            onClick={() => user?.avatar && setPreviewOpen(true)}
          />
          {uploading && (
            <CircularProgress
              size={130}
              sx={{
                position: 'absolute',
                top: -5,
                left: -5,
                zIndex: 1,
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            disabled={uploading}
          >
            {user?.avatar ? 'Change Photo' : 'Upload Photo'}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>

          {user?.avatar && (
            <IconButton
              color="error"
              onClick={handleDeleteAvatar}
              disabled={uploading}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Profile Picture</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <img 
            src={user?.avatar} 
            alt="Profile" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '400px',
              borderRadius: '8px'
            }} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AvatarUpload;