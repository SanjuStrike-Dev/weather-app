const API_KEY = '7c7236884dd110cc2ec9ed9aa5da6001';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// City search API for autocomplete
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0';

export const weatherService = {
  // Get current weather
  async getCurrentWeather(query) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?${query}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (data.cod !== 200) {
        throw new Error(data.message || 'City not found');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get 10-day forecast (OpenWeatherMap provides 5-day, but we can extend it)
  async getForecast(query) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?${query}&appid=${API_KEY}&units=metric&cnt=80`
      );
      const data = await response.json();
      
      if (data.cod !== '200') {
        throw new Error(data.message || 'Forecast not available');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get city suggestions for autocomplete
  async getCitySuggestions(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    try {
      const response = await fetch(
        `${GEOCODING_URL}/direct?q=${encodeURIComponent(searchTerm)}&limit=5&appid=${API_KEY}`
      );
      const data = await response.json();
      
      return data.map(city => ({
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon,
        displayName: `${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`
      }));
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      return [];
    }
  },

  // Get weather alerts
  async getWeatherAlerts(query) {
    try {
      const response = await fetch(
        `${BASE_URL}/onecall?${query}&appid=${API_KEY}&units=metric&exclude=current,minutely,hourly,daily`
      );
      const data = await response.json();
      
      return data.alerts || [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  }
};
