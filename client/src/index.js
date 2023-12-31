// Import necessary modules from their respective packages
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";
// Import the Redux store
import store from "./store/store";
// Import the main App component
import App from "./components/App";

// Define global styles using styled-components' createGlobalStyle
const GlobalStyle = createGlobalStyle`
  // Apply box-sizing: border-box to all elements
  *,
  *::before, 
  *::after {
    box-sizing: border-box;
  }

  // Remove default margin from html and body elements
  html, body {
    margin: 0;
  }

  // Set a default font for the body element
  body {
    font-family: BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
  }
`;

// Create a root for your application
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render your application
root.render(
  // Wrap the application in a Redux Provider with the Redux store
  <Provider store={store}>
    {/* Wrap the application in a BrowserRouter to enable routing */}
    <BrowserRouter>
      {/* Include the global styles */}
      <GlobalStyle />
      {/* Render the main App component */}
      <App />
    </BrowserRouter>
  </Provider>
);