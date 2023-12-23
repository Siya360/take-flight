import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './NavBar';
import FlightList from '../pages/FlightList';
import NewFlight from '../pages/NewFlight';

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Switch>
          <Route path="/new">
            <NewFlight />
          </Route>
          <Route path="/">
            <FlightList />
          </Route>
          {/* Redirect all other paths to the main flight list page */}
          <Route path="*">
            <FlightList />
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;


