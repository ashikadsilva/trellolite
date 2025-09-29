import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { showToast } from '../utils/toast';
import { ThemeContext } from './context/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);

  const handleToggle = () => {
    toggleTheme();
    showToast.info(`Switched to ${mode === 'light' ? 'dark' : 'light'} mode`);
  };

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton 
        onClick={handleToggle} 
        color="inherit"
        sx={{
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;