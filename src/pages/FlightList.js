import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles";
import "./Flights.css"

function FlightList({ user }) {

  function handleDelete(id){
    fetch('http://127.0.0.1:3000/flights/' + id, {
      method: 'DELETE'
    })
    console.log("Deleted")    
  }
  
  return (
    <>
      <UserHeader>Welcome, {user.first_name}!</UserHeader>
      <Wrapper>
      {user.flights.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Flight To</th>
                  <th>Flight From</th>
                  <th>Flight Date</th>
                  <th>Return Date</th>
                </tr>

              </thead>
              {user.flights.map((flight, i) => {
                console.log(flight)
                return(
                  <tbody>
                    <tr key={i} value={flight}>
                      <td>{flight.destination}</td>
                      <td>{flight.departure}</td>
                      <td>{flight.flight_date}</td>
                      <td>{flight.return_date}</td>
                      <button onClick={()=>handleDelete(flight.id)}>&#10006;</button>
                    </tr>                
                  </tbody>
                )
              
              })}
            </table>

       ) : (
         <>
           <h2>No Flights Found</h2>
           <Button as={Link} to="/new">
             Book a new flight
           </Button>
         </>
       )} 
    </Wrapper>
    </>
  );
}

const Wrapper = styled.section`
  max-width: 800px;
  margin: 40px auto;
`;

const UserHeader = styled.h1`
  font-size: 35px;
  font-weight: 400;
  color: indigo;
  font-family: "Permanent Marker", cursive;
  margin: 10px;
`;



export default FlightList;
