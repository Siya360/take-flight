import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';

function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            All Flights
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/new">
          New Flight
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
