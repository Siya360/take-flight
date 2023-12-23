import React from 'react';
import { TextField } from '@material-ui/core';

const Input = (props) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      {...props}
    />
  );
};

export default Input;
