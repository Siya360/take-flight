import React, { useState } from "react";
import { signUpUser } from '../utils/api'; // Import the signUpUser function
import PropTypes from 'prop-types';
import FormField from '../styles/FormField';
import Input from '../styles/Input';
import Label from '../styles/Label';
import Error from '../styles/Error';
import Button from '../styles/Button';

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

 // Define propTypes for SignUpForm
 SignUpForm.propTypes = {
  onSignUp: PropTypes.func.isRequired, // Validates that onSignUp prop is a function and is required
};

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const userData = { firstName, lastName, email, gender, age, password, passwordConfirmation };
    signUpUser(userData)
      .then(user => {
        setIsLoading(false);
        onSignUp(user); // This might log the user in or redirect
      })
      .catch(err => {
        setIsLoading(false);
        setErrors([err.message]); // Adjust based on the error format
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField>
        <Label htmlFor="username">First Name</Label>
        <Input
          type="text"
          id="username"
          autoComplete="off"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </FormField>
      <FormField>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="current-password"
        />
      </FormField>
      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="current-password"
        />
      </FormField>
      <FormField>
        <Label htmlFor="gender">Gender</Label>
        <Input
          type="text"
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          autoComplete="current-password"
        />
      </FormField>
      <FormField>
        <Label htmlFor="age">Age</Label>
        <Input
          type="number"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          autoComplete="current-password"
        />
      </FormField>
      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </FormField>
      <FormField>
        <Label htmlFor="password">Password Confirmation</Label>
        <Input
          type="password"
          id="password_confirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          autoComplete="current-password"
        />
      </FormField>
      
  
      <FormField>
        <Button type="submit">{isLoading ? "Loading..." : "Sign Up"}</Button>
      </FormField>
      <FormField>
        {errors.map((err) => (
          <Error key={err}>{err}</Error>
        ))}
      </FormField>
    </form>
  );
}

// Define propTypes for SignUpForm
SignUpForm.propTypes = {
  onSignUp: PropTypes.func.isRequired, // Validates that onSignUp prop is a function and is required
};

export default SignUpForm;
