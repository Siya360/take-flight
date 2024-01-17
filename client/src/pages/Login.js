import { useState } from "react";
import styled from "styled-components"; // Ensure this import is used
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import { Button } from "../styles";
import { loginUser, signUpUser } from '../utils/api'; // Import API functions

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
      <Logo>Flight Booking</Logo>
      {showLogin ? (
        <>
          <LoginForm onLogin={handleLogin} />
          <Divider />
          <p>
            Don't have an account? &nbsp;
            <Button color="secondary" onClick={() => setShowLogin(false)}>
              Sign Up
            </Button>
          </p>
        </>
      ) : (
        <>
          <SignUpForm onSignUp={handleSignUp} />
          <Divider />
          <p>
            Already have an account? &nbsp;
            <Button color="secondary" onClick={() => setShowLogin(true)}>
              Log In
            </Button>
          </p>
        </>
      )}
    </Wrapper>
  );
}
// Styled components
const Logo = styled.h1`
  font-family: "Permanent Marker", cursive;
  font-size: 3rem;
  color: deeppink;
  margin: 8px 0 16px;
`;

const Wrapper = styled.section`
  max-width: 500px;
  margin: 40px auto;
  padding: 16px;
`;

const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid #ccc;
  margin: 16px 0;
`;

export default Login;
