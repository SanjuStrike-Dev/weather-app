import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Navigation } from 'lucide-react';

const SearchBar = forwardRef(({ onSearch, onLocationClick }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clearSearchInput: () => {
      setSearchTerm('');
    }
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      // Remove focus from input
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Capitalize first letter
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setSearchTerm(capitalizedValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm.trim()) {
        onSearch(searchTerm);
        // Remove focus from input
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    }
  };

  const handleLocationClick = () => {
    // Clear the search input when location button is clicked
    setSearchTerm('');
    // Call the parent's location click handler
    onLocationClick();
  };

  return (
    <div className="search-container" ref={searchRef}>
      <motion.form 
        className="search-bar"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="search-input-container">
          <MapPin className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          <motion.button
            type="submit"
            className="search-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!searchTerm.trim()}
          >
            <Search size={18} />
          </motion.button>
          <motion.button
            type="button"
            className="location-button"
            onClick={handleLocationClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Use current location"
          >
            <Navigation size={18} />
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
});

export default SearchBar;
