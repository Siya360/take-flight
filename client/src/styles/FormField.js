import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const Label = ({ children, ...props }) => {
  return (
    <Typography
      variant="subtitle1"
      style={{ marginBottom: 8, fontWeight: 700 }}
      {...props}
    >
      {children}
    </Typography>
  );
};

Label.propTypes = {
  children: PropTypes.node, // Validates that children can be any renderable content
};

export default Label;
