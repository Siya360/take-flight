import React, { useState } from "react";
import { loginUser } from '../utils/api';
import PropTypes from 'prop-types';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define propTypes
  LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    loginUser({ email, password })
      .then(user => {
        setIsLoading(false);
        onLogin(user);
      })
      .catch(err => {
        setIsLoading(false);
        setErrors([err.message]);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          label="Email"
          type="text"
          fullWidth
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Password"
          type="password"
          fullWidth
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? <CircularProgress size={24} /> : "Login"}
      </Button>
      {errors.length > 0 && (
        <Box mt={2}>
          {errors.map((err, index) => (
            <Typography color="error" key={index}>{err}</Typography>
          ))}
        </Box>
      )}
    </form>
  );
}

export default LoginForm;
