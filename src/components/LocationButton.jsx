import React from 'react';
import './LocationButton.css';

const LocationButton = ({ onLocationClick, loading }) => {
  return (
    <button 
      className="location-button"
      onClick={onLocationClick}
      disabled={loading}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      {loading ? 'Getting Location...' : 'Use My Location'}
    </button>
  );
};

export default LocationButton;
