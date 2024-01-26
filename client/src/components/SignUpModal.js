import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Box } from '@mui/material';
import SignUpForm from './SignUpForm';

function getModalStyle() {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4, // padding shorthand
  };
}

function SignUpModal({ open, onClose, onSignUp }) {
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle, setModalStyle] = useState(getModalStyle);

  // Update modal style when 'open' changes
  useEffect(() => {
    if (open) {
      setModalStyle(getModalStyle());
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="sign-up-modal-title"
      aria-describedby="sign-up-modal-description"
    >
      <Box sx={modalStyle}>
        <SignUpForm onSignUp={onSignUp} />
      </Box>
    </Modal>
  );
}

SignUpModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
};

export default SignUpModal;
