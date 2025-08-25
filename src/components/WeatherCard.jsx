import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ weather, loading, error }) => {
  if (loading) {
    return (
      <div className="weather-card loading">
        <div className="spinner"></div>
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  // Add safety checks for the data structure
  if (!weather.current || !weather.location) {
    console.error('Weather data structure is invalid:', weather);
    return (
      <div className="weather-card error">
        <h3>Invalid Data</h3>
        <p>Weather data format is not recognized. Please try again.</p>
      </div>
    );
  }

  try {
    // Extract data from our backend API structure with fallbacks
    const {
      location: { name = 'Unknown', country = '' } = {},
      current: { 
        temperature = 0, 
        feelsLike = 0, 
        humidity = 0, 
        pressure = 0, 
        windSpeed = 0, 
        visibility = 0, 
        description = 'No description available', 
        icon = '01d'
      } = {}
    } = weather;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    return (
      <div className="weather-card">
        <div className="weather-card-header">
          <h2>{name}{country && `, ${country}`}</h2>
          <div className="weather-main">
            <img src={iconUrl} alt={description} className="weather-icon" />
            <div className="temperature">
              <span className="temp">{Math.round(temperature)}°C</span>
              <span className="description">{description}</span>
            </div>
          </div>
        </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span className="label">Feels like:</span>
          <span className="value">{Math.round(feelsLike)}°C</span>
        </div>
        <div className="detail-item">
          <span className="label">Humidity:</span>
          <span className="value">{humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="label">Wind Speed:</span>
          <span className="value">{windSpeed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="label">Pressure:</span>
          <span className="value">{pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span className="label">Visibility:</span>
          <span className="value">{visibility} km</span>
        </div>
      </div>
    </div>
  );
  } catch (err) {
    console.error('Error rendering weather data:', err);
    return (
      <div className="weather-card error">
        <h3>Display Error</h3>
        <p>There was an error displaying the weather data. Please try again.</p>
      </div>
    );
  }
};

export default WeatherCard;
