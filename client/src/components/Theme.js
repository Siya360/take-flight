import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6', // Main colour
    },
    secondary: {
      main: '#19857b', // secondary colour
    },
    error: {
      main: '#ff1744', // example colour
    },
    // ...add other colours if needed
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    // ...We can add other typographic styles if needed
  },
  // ...we can add other customizations if needed
});

export default Theme;
