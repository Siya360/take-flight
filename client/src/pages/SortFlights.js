import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, MenuItem } from '@mui/material';

const sortOptions = [
  { label: 'Price Low to High', value: 'PriceLowToHigh' },
  { label: 'Price High to Low', value: 'PriceHighToLow' },
  { label: 'Duration Short to Long', value: 'DurationShortToLong' },
  { label: 'Duration Long to Short', value: 'DurationLongToShort' },
];
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
        {sortOptions.map(option => (
          <MenuItem key={option.value} onClick={() => handleSort(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

// Define PropTypes
SortFlights.propTypes = {
  onSort: PropTypes.func.isRequired,
};

export default SortFlights;
