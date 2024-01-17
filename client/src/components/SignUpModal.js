import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import SignUpForm from './SignUpForm';
import { makeStyles } from '@material-ui/core/styles';

// Function to get modal style
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// Styles for the modal
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function SignUpModal({ open, onClose, onSignUp }) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="sign-up-modal-title"
aria-describedby="sign-up-modal-description"
>
<div style={modalStyle} className={classes.paper}>
<SignUpForm onSignUp={onSignUp} />
</div>
</Modal>
);
}

SignUpModal.propTypes = {
open: PropTypes.bool.isRequired,
onClose: PropTypes.func.isRequired,
onSignUp: PropTypes.func.isRequired,
};

export default SignUpModal;