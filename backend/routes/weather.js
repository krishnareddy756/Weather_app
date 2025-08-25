const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const { validateCoordinates, validateCityName } = require('../middleware/validation');

// Get current weather by coordinates
router.get('/current', validateCoordinates, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const weatherData = await weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lon));
    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get weather forecast by coordinates
router.get('/forecast', validateCoordinates, async (req, res) => {
  try {
    const { lat, lon, days = 5 } = req.query;
    const forecastData = await weatherService.getForecast(
      parseFloat(lat), 
      parseFloat(lon), 
      parseInt(days)
    );
    res.json({
      success: true,
      data: forecastData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get current weather by city name
router.get('/current/:city', validateCityName, async (req, res) => {
  try {
    const { city } = req.params;
    
    // First get location coordinates
    const locations = await weatherService.getLocationByName(city);
    if (locations.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'City not found'
      });
    }
    
    const location = locations[0];
    const weatherData = await weatherService.getCurrentWeather(location.lat, location.lon);
    
    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get weather forecast by city name
router.get('/forecast/:city', validateCityName, async (req, res) => {
  try {
    const { city } = req.params;
    const { days = 5 } = req.query;
    
    // First get location coordinates
    const locations = await weatherService.getLocationByName(city);
    if (locations.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'City not found'
      });
    }
    
    const location = locations[0];
    const forecastData = await weatherService.getForecast(location.lat, location.lon, parseInt(days));
    
    res.json({
      success: true,
      data: forecastData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
