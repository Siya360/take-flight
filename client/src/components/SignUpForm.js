import React, { useState } from "react";
import { signUpUser } from '../utils/api';
import PropTypes from 'prop-types';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

const SignUpForm = ({ onSignUp }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const userData = { firstName, lastName, email, gender, age, password, passwordConfirmation };
    signUpUser(userData)
      .then(user => {
        setIsLoading(false);
        onSignUp(user);
      })
      .catch(err => {
        setIsLoading(false);
        setErrors([...errors, err.message]);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField 
          label="First Name" 
          type="text" 
          fullWidth 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField 
          label="Last Name" 
          type="text" 
          fullWidth 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField 
          label="Age" 
          type="text" 
          fullWidth 
          value={age} 
          onChange={(e) => setAge(e.target.value)}
        />
        <TextField
          label="Gender"
          type="text"
          fullWidth
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
        <TextField 
          label="Email" 
          type="text" 
          fullWidth 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField 
          label="Password" 
          type="text" 
          fullWidth 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField 
          label="Password Confirmation" 
          type="text" 
          fullWidth 
          value={passwordConfirmation} 
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
      </Box>
      <Button 
        variant="contained" 
        color="primary" 
        type="submit" 
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
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

SignUpForm.propTypes = {
  onSignUp: PropTypes.func.isRequired,
};

export default SignUpForm;
