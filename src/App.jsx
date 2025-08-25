import { useState } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchForm from './components/SearchForm';
import LocationButton from './components/LocationButton';
import { getCurrentWeather, getCurrentLocationWeather } from './services/weatherService';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await getCurrentWeather(city);
      setWeather(weatherData);
    } catch (err) {
      setError('City not found. Please check the spelling and try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await getCurrentLocationWeather();
      setWeather(weatherData);
    } catch (err) {
      setError('Unable to get your location. Please search for a city instead.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather App</h1>
        <p>Get current weather information for any city</p>
      </header>
      
      <main className="app-main">
        <div className="search-section">
          <SearchForm onSearch={handleSearch} loading={loading} />
          <LocationButton onLocationClick={handleLocationClick} loading={loading} />
        </div>
        
        <WeatherCard weather={weather} loading={loading} error={error} />
        
        {!weather && !loading && !error && (
          <div className="welcome-message">
            <h2>Welcome to Weather App</h2>
            <p>Search for a city or use your current location to get started!</p>
            <div className="features">
              <div className="feature">
                <span>🌡️</span>
                <span>Real-time temperature</span>
              </div>
              <div className="feature">
                <span>💨</span>
                <span>Wind speed & direction</span>
              </div>
              <div className="feature">
                <span>💧</span>
                <span>Humidity levels</span>
              </div>
              <div className="feature">
                <span>👁️</span>
                <span>Visibility distance</span>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Weather data provided by OpenWeatherMap API</p>
        <p className="api-note">
          <strong>Note:</strong> Please replace 'your_openweathermap_api_key_here' in weatherService.js with your actual API key from{' '}
          <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">
            OpenWeatherMap
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
