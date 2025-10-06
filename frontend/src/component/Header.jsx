import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { showToast } from '../utils/toast';
import { AuthContext } from './context/AuthProvider';
import UserAvatar from './profilePicture/UserAvatar';

const Header = () => {
  const navigate = useNavigate();
  const { keycloakAuth, user } = useContext(AuthContext);

  const handleLogout = () => {
    showToast.info('Logging out...');
    setTimeout(() => {
      keycloakAuth.logout({
        redirectUri: window.location.origin
      });
    }, 500);
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 700,
          }}
          onClick={() => navigate('/')}
        >
          🚀 TrelloLite
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          
          <Button 
            color="inherit" 
            onClick={() => navigate('/profile')}
          >
            Profile
          </Button>

          {user?.roles?.includes('admin') && (
            <Button 
              color="inherit" 
              onClick={() => navigate('/admin')}
            >
              Admin
            </Button>
          )}

          <ThemeToggle />

          <UserAvatar 
            user={user}
            size={36}
            onClick={() => navigate('/profile')}
          />

          <Button 
            color="inherit" 
            variant="outlined"
            onClick={handleLogout}
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;