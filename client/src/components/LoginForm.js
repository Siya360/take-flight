import React, { useState } from "react";
import { loginUser } from '../utils/api'; // Import the loginUser function
import PropTypes from 'prop-types';
import FormField from '../styles/FormField';
import Input from '../styles/Input';
import Label from '../styles/Label';
import Error from '../styles/Error';
import Button from '../styles/Button';


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
      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input
          type="text"
          id="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      <FormField>
        <Button variant="fill" color="primary" type="submit">
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </FormField>
      {errors.length > 0 && (
  <FormField>
    {errors.map((err, index) => (
      // If error strings are unique
      <Error key={err}>{err}</Error>
      // If not unique, consider another method to generate a unique key
    ))}
  </FormField>
)}

    </form>
  );
}

export default LoginForm;

