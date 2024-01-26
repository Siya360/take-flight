import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
function NavBar({ onLoginClick, onSignUpClick }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {/* Use RouterLink as the component for MUI Link */}
          <Button component={RouterLink} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
            TakeFlight
          </Button>
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

NavBar.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  onSignUpClick: PropTypes.func.isRequired,
};

export default NavBar;
