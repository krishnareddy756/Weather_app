const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const { validateCoordinates, validateCityName } = require('../middleware/validation');

// Search locations by city name
router.get('/search', validateCityName, async (req, res) => {
  try {
    const { q: cityName } = req.query;
    const locations = await weatherService.getLocationByName(cityName);
    
    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get location details by coordinates (reverse geocoding)
router.get('/reverse', validateCoordinates, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const location = await weatherService.getLocationByCoords(parseFloat(lat), parseFloat(lon));
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
