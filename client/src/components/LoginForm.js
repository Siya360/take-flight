// Import necessary modules and components
import React, { useState } from "react";
import { loginUser } from '../utils/api';
import PropTypes from 'prop-types';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

// Define the LoginForm component
const LoginForm = ({ onLogin }) => {
  // Define state variables for email, password, errors, and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define a function to validate the form
  const validateForm = () => {
    // Basic validation logic, modify this as needed
    return email.includes('@') && password.length >= 8;
  };

  // Define a function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // If the form is not valid, return early
    if (!validateForm()) return;

    // Set loading state to true and attempt to log in
    setIsLoading(true);
    loginUser({ email, password })
      .then(user => {
        // If login is successful, set loading state to false and call onLogin
        setIsLoading(false);
        onLogin(user);
      })
      .catch(err => {
        // If an error occurs, set loading state to false and set the error message
        setIsLoading(false);
        setErrors([err.message]);
      });
  }

  // Define propTypes for the LoginForm component
  LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  // Render the form
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
            <Typography color="error" key={err}>{err}</Typography> 
          ))}
        </Box>
      )}
    </form>
  );
}

// Export the LoginForm component
export default LoginForm;