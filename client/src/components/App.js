import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './NavBar';
import FlightList from '../pages/FlightList';
import NewFlight from '../pages/NewFlight';
import FlightDetails from '../pages/FlightDetails';
import LoginModal from '../components/LoginModal'; 
import SignUpModal from '../components/SignUpModal'; 
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/Theme.js';

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);
  const handleSignUpModalOpen = () => setSignUpModalOpen(true);
  const handleSignUpModalClose = () => setSignUpModalOpen(false);

  const handleSignUp = (userData) => {
    // Implement your sign-up logic here
    // For example, making an API call with the user data
  };

  return (
    <ThemeProvider theme={theme}> 
      <NavBar 
        onLoginClick={handleLoginModalOpen}
        onSignUpClick={handleSignUpModalOpen}
      />
      <main>
        <Switch>
          <Route exact path="/">
            <NewFlight />
          </Route>
          <Route path="/flights">
            <FlightList />
          </Route>
          <Route path="/flight-details/:id">
            <FlightDetails />
          </Route>
          <Route path="*">
            <NewFlight />
          </Route>
        </Switch>
      </main>
      <LoginModal open={loginModalOpen} onClose={handleLoginModalClose} />
      <SignUpModal 
        open={signUpModalOpen} 
        onClose={handleSignUpModalClose} 
        onSignUp={handleSignUp} // Passing the handleSignUp function
      />
    </ThemeProvider>
  );
}

export default App;
