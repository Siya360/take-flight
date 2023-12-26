import React from 'react';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

let MyError = ({ children }) => {
  return (
    <Alert severity="error" style={{ margin: '8px 0' }}>
      {children}
    </Alert>
  );
};

MyError.propTypes = {
  children: PropTypes.node,
};

export default MyError;
