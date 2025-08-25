const axios = require('axios');

class WeatherService {
  constructor() {
    this.openWeatherMapAPIKey = process.env.OPENWEATHERMAP_API_KEY;
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.geoURL = 'https://api.openweathermap.org/geo/1.0';
  }

  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(`${this.baseURL}/weather`, {
        params: {
          lat,
          lon,
          appid: this.openWeatherMapAPIKey,
          units: 'metric'
        }
      });

      return this.formatCurrentWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching current weather:', error.response?.data || error.message);
      throw new Error('Failed to fetch current weather data');
    }
  }

  async getForecast(lat, lon, days = 5) {
    try {
      const response = await axios.get(`${this.baseURL}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.openWeatherMapAPIKey,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (3-hour intervals)
        }
      });

      return this.formatForecastData(response.data);
    } catch (error) {
      console.error('Error fetching forecast:', error.response?.data || error.message);
      throw new Error('Failed to fetch forecast data');
    }
  }

  async getLocationByName(cityName) {
    try {
      const response = await axios.get(`${this.geoURL}/direct`, {
        params: {
          q: cityName,
          limit: 5,
          appid: this.openWeatherMapAPIKey
        }
      });

      return response.data.map(location => ({
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon
      }));
    } catch (error) {
      console.error('Error fetching location:', error.response?.data || error.message);
      throw new Error('Failed to fetch location data');
    }
  }

  async getLocationByCoords(lat, lon) {
    try {
      const response = await axios.get(`${this.geoURL}/reverse`, {
        params: {
          lat,
          lon,
          limit: 1,
          appid: this.openWeatherMapAPIKey
        }
      });

      if (response.data.length === 0) {
        throw new Error('Location not found');
      }

      const location = response.data[0];
      return {
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon
      };
    } catch (error) {
      console.error('Error fetching location by coords:', error.response?.data || error.message);
      throw new Error('Failed to fetch location data');
    }
  }

  formatCurrentWeatherData(data) {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      current: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: data.uvi || 0,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        condition: data.weather[0].main
      },
      sun: {
        sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
        sunset: new Date(data.sys.sunset * 1000).toISOString()
      },
      timestamp: new Date().toISOString()
    };
  }

  formatForecastData(data) {
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          temperatures: [],
          conditions: [],
          descriptions: [],
          icons: [],
          humidity: [],
          windSpeed: []
        };
      }
      
      dailyForecasts[date].temperatures.push(item.main.temp);
      dailyForecasts[date].conditions.push(item.weather[0].main);
      dailyForecasts[date].descriptions.push(item.weather[0].description);
      dailyForecasts[date].icons.push(item.weather[0].icon);
      dailyForecasts[date].humidity.push(item.main.humidity);
      dailyForecasts[date].windSpeed.push(item.wind.speed);
    });

    const forecast = Object.values(dailyForecasts).map(day => ({
      date: day.date,
      temperature: {
        min: Math.round(Math.min(...day.temperatures)),
        max: Math.round(Math.max(...day.temperatures)),
        avg: Math.round(day.temperatures.reduce((a, b) => a + b, 0) / day.temperatures.length)
      },
      condition: this.getMostCommonValue(day.conditions),
      description: this.getMostCommonValue(day.descriptions),
      icon: this.getMostCommonValue(day.icons),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length)
    }));

    return {
      location: {
        name: data.city.name,
        country: data.city.country,
        lat: data.city.coord.lat,
        lon: data.city.coord.lon
      },
      forecast,
      timestamp: new Date().toISOString()
    };
  }

  getMostCommonValue(array) {
    const frequency = {};
    let maxCount = 0;
    let mostCommon = array[0];

    array.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
      if (frequency[item] > maxCount) {
        maxCount = frequency[item];
        mostCommon = item;
      }
    });

    return mostCommon;
  }
}

module.exports = new WeatherService();
