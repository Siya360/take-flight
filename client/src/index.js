// Import createRoot from react-dom/client instead of react-dom
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";
import store from "./store/store";
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

// Use the createRoot method correctly by importing from react-dom/client
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <GlobalStyle />
      <App />
    </BrowserRouter>
  </Provider>
);