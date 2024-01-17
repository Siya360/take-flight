import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
function NavBar({ onLoginClick, onSignUpClick }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            TakeFlight
          </Link>
        </Typography>
        <Button color="inherit" onClick={onLoginClick}>
          Login
        </Button>
        <Button color="inherit" onClick={onSignUpClick}>
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
}

// Define PropTypes for NavBar
NavBar.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  onSignUpClick: PropTypes.func.isRequired,
};

export default NavBar;


