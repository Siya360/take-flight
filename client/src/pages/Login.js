import { useState } from "react";
import { styled } from '@mui/material/styles';
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import { Button, Typography, Divider, Box } from '@mui/material';
import { loginUser, signUpUser } from '../utils/api';

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = async (loginData) => {
    try {
      const userData = await loginUser(loginData);
      // Handle successful login (e.g., store user data, redirect, etc.)
      console.log(userData); // Replace with actual login logic
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login errors (e.g., show error message)
    }
  };

  const handleSignUp = async (signUpData) => {
    try {
      const userData = await signUpUser(signUpData);
      // Handle successful sign-up (e.g., store user data, redirect, etc.)
      console.log(userData); // Replace with actual sign-up logic
    } catch (error) {
      console.error("Sign-up failed:", error);
      // Handle sign-up errors (e.g., show error message)
    }
  };

  return (
    <Wrapper>
      <Typography variant="h3" component="h1" gutterBottom>
        Flight Booking
      </Typography>
      {showLogin ? (
        <>
          <LoginForm onLogin={handleLogin} />
          <StyledDivider />
          <Typography>
            Don't have an account? &nbsp;
            <Button color="secondary" onClick={() => setShowLogin(false)}>
              Sign Up
            </Button>
          </Typography>
        </>
      ) : (
        <>
          <SignUpForm onSignUp={handleSignUp} />
          <StyledDivider />
          <Typography>
            Already have an account? &nbsp;
            <Button color="secondary" onClick={() => setShowLogin(true)}>
              Log In
            </Button>
          </Typography>
        </>
      )}
    </Wrapper>
  );
}
// Styled components using MUI's styled
const Wrapper = styled(Box)(({ theme }) => ({
  maxWidth: '500px',
  margin: '40px auto',
  padding: '16px',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

export default Login;