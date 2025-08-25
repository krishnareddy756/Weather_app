# Weather API Backend

A RESTful API backend for the Weather Website built with Node.js, Express, and OpenWeatherMap API.

## Features

- 🌤️ Current weather data by coordinates or city name
- 📅 5-day weather forecast
- 🗺️ Location search and reverse geocoding
- 🔒 Input validation and error handling
- 🚀 Fast and lightweight
- 📡 CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your OpenWeatherMap API key to `.env`:
```env
OPENWEATHERMAP_API_KEY=your_actual_api_key_here
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Weather Endpoints

#### Get Current Weather by Coordinates
```http
GET /api/weather/current?lat=40.7128&lon=-74.0060
```

#### Get Current Weather by City Name
```http
GET /api/weather/current/New York
```

#### Get Weather Forecast by Coordinates
```http
GET /api/weather/forecast?lat=40.7128&lon=-74.0060&days=5
```

#### Get Weather Forecast by City Name
```http
GET /api/weather/forecast/New York?days=5
```

### Location Endpoints

#### Search Locations
```http
GET /api/location/search?q=New York
```

#### Reverse Geocoding
```http
GET /api/location/reverse?lat=40.7128&lon=-74.0060
```

### Utility Endpoints

#### Health Check
```http
GET /api/health
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `OPENWEATHERMAP_API_KEY` | OpenWeatherMap API key | Required |

## Project Structure

```
backend/
├── server.js              # Main server file
├── routes/
│   ├── weather.js         # Weather API routes
│   └── location.js        # Location API routes
├── services/
│   └── weatherService.js  # Weather service logic
├── middleware/
│   └── validation.js      # Input validation middleware
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid coordinates
- Invalid city names
- Missing API keys
- External API failures
- Server errors

## Rate Limiting

OpenWeatherMap free tier includes:
- 1,000 API calls per day
- 60 API calls per minute

Consider implementing rate limiting for production use.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
