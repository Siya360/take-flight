import React from 'react';
import { TextField } from '@material-ui/core';

const Textarea = (props) => {
  return (
    <TextField
      multiline
      variant="outlined"
      fullWidth
      {...props}
    />
  );
};

export default Textarea;

