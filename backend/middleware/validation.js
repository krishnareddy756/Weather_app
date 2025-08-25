const validateCoordinates = (req, res, next) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      error: 'Latitude and longitude are required',
      message: 'Please provide both lat and lon query parameters'
    });
  }
  
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid coordinates',
      message: 'Latitude and longitude must be valid numbers'
    });
  }
  
  if (latitude < -90 || latitude > 90) {
    return res.status(400).json({
      success: false,
      error: 'Invalid latitude',
      message: 'Latitude must be between -90 and 90 degrees'
    });
  }
  
  if (longitude < -180 || longitude > 180) {
    return res.status(400).json({
      success: false,
      error: 'Invalid longitude',
      message: 'Longitude must be between -180 and 180 degrees'
    });
  }
  
  next();
};

const validateCityName = (req, res, next) => {
  const cityName = req.params.city || req.query.q;
  
  if (!cityName) {
    return res.status(400).json({
      success: false,
      error: 'City name is required',
      message: 'Please provide a city name'
    });
  }
  
  if (typeof cityName !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid city name',
      message: 'City name must be a string'
    });
  }
  
  if (cityName.trim().length < 1) {
    return res.status(400).json({
      success: false,
      error: 'Invalid city name',
      message: 'City name cannot be empty'
    });
  }
  
  if (cityName.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Invalid city name',
      message: 'City name is too long (max 100 characters)'
    });
  }
  
  next();
};

const validateApiKey = (req, res, next) => {
  if (!process.env.OPENWEATHERMAP_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'Server configuration error',
      message: 'Weather API key is not configured'
    });
  }
  
  next();
};

module.exports = {
  validateCoordinates,
  validateCityName,
  validateApiKey
};
