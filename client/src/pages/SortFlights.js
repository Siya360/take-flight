import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function SortFlights({ onSort }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSort, setSelectedSort] = useState('Best');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (sortOption) => {
    setSelectedSort(sortOption);
    onSort(sortOption);
    handleClose();
  };

  return (
    <div>
      <Button aria-controls="sort-menu" aria-haspopup="true" onClick={handleClick}>
        Sort by: {selectedSort}
      </Button>
      <Menu
        id="sort-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSort('Price Low to High')}>Price Low to High</MenuItem>
        <MenuItem onClick={() => handleSort('Price High to Low')}>Price High to Low</MenuItem>
        <MenuItem onClick={() => handleSort('Duration Short to Long')}>Duration Short to Long</MenuItem>
        <MenuItem onClick={() => handleSort('Duration Long to Short')}>Duration Long to Short</MenuItem>
      </Menu>
    </div>
  );
}
// Define PropTypes
SortFlights.propTypes = {
  onSort: PropTypes.func.isRequired,
};

export default SortFlights;
