import React from 'react';
import { Modal, Box } from '@mui/material';
import LoginForm from './LoginForm';

function getModalStyle() {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4, // padding shorthand
  };
}

function LoginModal({ open, onClose, onLogin }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={getModalStyle()}>
        <LoginForm onLogin={onLogin} />
      </Box>
    </Modal>
  );
}

export default LoginModal;
