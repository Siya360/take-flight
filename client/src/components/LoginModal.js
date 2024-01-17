import React from 'react';
import Modal from '@material-ui/core/Modal';
import LoginForm from './LoginForm';

// Function for styling 
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    position: 'absolute',
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    width: 400,
    backgroundColor: 'white',
    padding: '16px 32px 24px',
  };
}

function LoginModal({ open, onClose, onLogin }) {
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <Modal open={open} onClose={onClose}>
      <div style={modalStyle}>
        <LoginForm onLogin={onLogin} />
      </div>
    </Modal>
  );
}

export default LoginModal;
