import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import PropTypes from 'prop-types';

function Button({ variant = "contained", color = "primary", ...props }) {
  return <MuiButton variant={variant} color={color} {...props} />;
}

Button.propTypes = {
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'default', 'inherit']),
};

export default Button;
