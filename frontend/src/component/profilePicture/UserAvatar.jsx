import { Avatar } from '@mui/material';
import React from 'react'

const UserAvatar = ({user, size=40, onClick, sx= {}}) => {
    const getInitials = (name) => {
        if(!name)
            return '?';
        const parts =  name.split(' ');
        if(parts.length >= 2){
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0,2).toUpperCase();
    };

    const getColorFromName = (name) => {
        if(!name)
            return '#757575';

        const colors = [
            '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
            '#2196f3', '#00bcd4', '#009688', '#4caf50',
            '#ff9800', '#ff5722', '#795548', '#607d8b'
        ];
        
    const charCode = name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);
    return colors[charCode % colors.length];
};

  return (
    <Avatar
      src={user?.avatar || ''}
      alt={user?.name || 'User'}
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        bgcolor: user?.avatar ? 'transparent' : getColorFromName(user?.name),
        cursor: onClick ? 'pointer' : 'default',
        fontSize: size / 2.5,
        fontWeight: 600,
        transition: 'transform 0.2s ease',
        '&:hover': onClick ? {
          transform: 'scale(1.1)',
        } : {},
        ...sx,
      }}
    >
      {!user?.avatar && getInitials(user?.name)}
    </Avatar>
  );
};

export default UserAvatar;