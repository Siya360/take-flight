import { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { Button, Error, FormField, Input, Label } from "../styles";

function NewRecipe({ user }) {
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [returnDate, setReturnDate] = useState("");


  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    fetch("http://127.0.0.1:3000/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destination: destination,
        departure: departure,
        flight_date: flightDate,
        return_date: returnDate
        
      }),
    }).then((r) => {
      setIsLoading(false);
      if (r.ok) {
        history.push("/");
      } else {
        r.json().then((err) => setErrors(err.errors));
      }
    });
  }

  return (
    <Wrapper>
      <WrapperChild>
        <h2>Fly now</h2>
        <form onSubmit={handleSubmit}>
        <FormField>
            <Label htmlFor="destination">Destination</Label>
            <Input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label htmlFor="departure">Departure</Label>
            <Input
              type="text"
              id="departure"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label htmlFor="flightDate">Flight date</Label>
            <Input
              type="date"
              id="flightDate"

              value={flightDate}
              onChange={(e) => setFlightDate(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label htmlFor="returnDate">Return Date</Label>
            <Input
              id="returnDate"
              data-date=""
              type="date"
              data-date-format="DD MMMM YYYY"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </FormField>
          <FormField>
            <Button color="primary" type="submit">
              {isLoading ? "Loading..." : "Submit Recipe"}
            </Button>
          </FormField>
          <FormField>
            {errors.map((err) => (
              <Error key={err}>{err}</Error>
            ))}
          </FormField>
        </form>
      </WrapperChild>
      <WrapperChild>
        <h1>Flight to: {destination}</h1>
        <p>
          <em>Flying from: {departure}</em>
          &nbsp;·&nbsp;
          <cite>By {user.first_name}</cite>
        </p>
      </WrapperChild>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 1000px;
  margin: 40px auto;
  padding: 16px;
  display: flex;
  gap: 24px;
`;

const WrapperChild = styled.div`
  flex: 1;
`;

export default NewRecipe;
