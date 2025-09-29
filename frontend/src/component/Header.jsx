import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { showToast } from '../utils/toast';
import { AuthContext } from './context/AuthProvider';

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

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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

          <Avatar 
            sx={{ 
              bgcolor: 'secondary.main', 
              cursor: 'pointer',
              width: 36,
              height: 36,
              fontSize: '0.9rem',
            }}
            onClick={() => navigate('/profile')}
          >
            {getInitials(user?.name)}
          </Avatar>

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