import React from 'react';
import { Box as MuiBox } from '@material-ui/core';

const Box = (props) => {
  return (
    <MuiBox
      boxShadow={3} // This applies a theme-based box-shadow. You can adjust the level as needed.
      borderRadius={6} // This applies a border-radius of 6px.
      p={2} // This applies padding. The unit is based on the theme's spacing scale.
      {...props} // This allows any other props to be passed down to the Box component.
    />
  );
};

export default Box;
