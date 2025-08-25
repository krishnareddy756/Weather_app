import axios from 'axios';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Get current weather by city name
export const getCurrentWeather = async (city) => {
  try {
    const response = await api.get(`/weather/current/${encodeURIComponent(city)}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch weather data');
  }
};

// Get weather by coordinates (latitude, longitude)
export const getWeatherByCoordinates = async (lat, lon) => {
  try {
    const response = await api.get('/weather/current', {
      params: { lat, lon }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch weather data');
  }
};

// Get 5-day weather forecast by city
export const getWeatherForecast = async (city) => {
  try {
    const response = await api.get(`/weather/forecast/${encodeURIComponent(city)}`, {
      params: { days: 5 }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch forecast data');
  }
};

// Get user's current location weather
export const getCurrentLocationWeather = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weather = await getWeatherByCoordinates(latitude, longitude);
          resolve(weather);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timeout';
            break;
          default:
            errorMessage = 'Unknown location error';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

// Get 5-day weather forecast by coordinates
export const getForecastByCoordinates = async (lat, lon) => {
  try {
    const response = await api.get('/weather/forecast', {
      params: { lat, lon, days: 5 }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch forecast data');
  }
};

// Search for locations
export const searchLocations = async (query) => {
  try {
    const response = await api.get('/location/search', {
      params: { q: query }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to search locations');
  }
};

// Get location details by coordinates (reverse geocoding)
export const getLocationByCoordinates = async (lat, lon) => {
  try {
    const response = await api.get('/location/reverse', {
      params: { lat, lon }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get location data');
  }
};

// Utility function to format weather data for display
export const formatWeatherData = (weatherData) => {
  return {
    temperature: Math.round(weatherData.current.temperature),
    feelsLike: Math.round(weatherData.current.feelsLike),
    humidity: weatherData.current.humidity,
    windSpeed: Math.round(weatherData.current.windSpeed),
    description: weatherData.current.description,
    icon: weatherData.current.icon,
    location: weatherData.location.name,
    country: weatherData.location.country,
  };
};

// Utility function to get weather icon URL
export const getWeatherIconUrl = (iconCode, size = '2x') => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};
