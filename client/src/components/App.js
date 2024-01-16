import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './NavBar';
import FlightList from '../pages/FlightList';
import NewFlight from '../pages/NewFlight';
import FlightDetails from '../pages/FlightDetails'; // Import FlightDetails

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Switch>
          <Route exact path="/">
            <NewFlight /> {/* Set NewFlight as the landing page */}
          </Route>
          <Route path="/flights">
            <FlightList />
          </Route>
          <Route path="/flight-details/:id">
            <FlightDetails /> {/* Route for specific flight details */}
          </Route>
          {/* Redirect all other paths to the NewFlight page */}
          <Route path="*">
            <NewFlight />
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;



