import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles";

function RecipeList() {
  const [flights, setFlights] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:3000/flights")
      .then((r) => r.json())
      .then((flight) => setFlights(flight));
  }, []);
  console.log(flights)

  return (
    <Wrapper>
      {/* {flights.length > 0 ? ( */}
            <table>
              <thead>
                <tr>
                  <th>Flight To</th>
                  <th>Flight From</th>
                  <th>Flight Date</th>
                  <th>Return Date</th>
                </tr>

              </thead>
              {/* {flights.map((flight, i) => {
                console.log(flight)
                return(
                  <tbody>
                    <tr key={i} value={flight}>
                      <td>{flight.destination}</td>
                      <td>{flight.departure}</td>
                      <td>{flight.flight_date}</td>
                      <td>{flight.return_date}</td>
                    </tr>                
                  </tbody>
                )
              
              })} */}
            </table>

      {/* // ) : (
      //   <>
      //     <h2>No Flights Found</h2>
      //     <Button as={Link} to="/new">
      //       Book a new flight
      //     </Button>
      //   </>
      // )} */}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 800px;
  margin: 40px auto;
`;



export default RecipeList;
