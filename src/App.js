import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Weather from './components/Weather';
import Forecast from './components/Forecast';
import SearchBar from './components/SearchBar';
import WeatherDetails from './components/WeatherDetails';
import LoadingSpinner from './components/LoadingSpinner';
import WeatherAnimation from './components/WeatherAnimation';
import { weatherService } from './services/weatherService';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherClass, setWeatherClass] = useState('default-bg');
  const [weatherAnimation, setWeatherAnimation] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true); // Always on by default
  const [currentQuery, setCurrentQuery] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);

  const fetchWeatherData = async (query, lat = null, lon = null, isAutoRefresh = false) => {
    // Only set loading if not already loading (for location requests) and not auto-refresh
    if (!loading && !isAutoRefresh) {
      setLoading(true);
    }
    setError(null);
    try {
      // Fetch current weather
      const weatherData = await weatherService.getCurrentWeather(query);
      setWeatherData(weatherData);

      // Fetch forecast
      const forecastData = await weatherService.getForecast(query);
      setForecastData(forecastData);

      // Fetch weather alerts if coordinates are available
      if (lat && lon) {
        const alertsData = await weatherService.getWeatherAlerts(`lat=${lat}&lon=${lon}`);
        setAlerts(alertsData);
      }

      // Update last update time
      setLastUpdate(new Date());

      // Store current query and coordinates for auto-refresh
      setCurrentQuery(query);
      setCurrentCoords({ lat, lon });

      // Determine weather class and animation
      const main = weatherData.weather?.[0]?.main?.toLowerCase();
      const description = weatherData.weather?.[0]?.description?.toLowerCase();
      
      if (main.includes('thunder') || description.includes('thunder')) {
        setWeatherClass('stormy-bg');
        setWeatherAnimation('storm');
      } else if (main.includes('rain') || main.includes('drizzle') || description.includes('rain')) {
        setWeatherClass('rainy-bg');
        setWeatherAnimation('rain');
      } else if (main.includes('snow') || description.includes('snow')) {
        setWeatherClass('snowy-bg');
        setWeatherAnimation('snow');
      } else if (main.includes('cloud') || description.includes('cloud')) {
        setWeatherClass('cloudy-bg');
        setWeatherAnimation('clouds');
      } else if (main.includes('clear') || description.includes('clear')) {
        setWeatherClass('sunny-bg');
        setWeatherAnimation('sun');
      } else if (main.includes('mist') || main.includes('fog') || description.includes('fog')) {
        setWeatherClass('foggy-bg');
        setWeatherAnimation('clouds');
      } else {
        setWeatherClass('default-bg');
        setWeatherAnimation(null);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      if (!isAutoRefresh) {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log('Location detected:', { latitude, longitude });
          fetchWeatherData(`lat=${latitude}&lon=${longitude}`, latitude, longitude);
        },
        (error) => {
          console.log('Geolocation error:', error);
          setError('location-not-found');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 // Force fresh location
        }
      );
    } else {
      setError('location-not-found');
    }
  }, []);

  // Auto-refresh weather data every minute
  useEffect(() => {
    if (!autoRefresh || !currentQuery) return;

    const interval = setInterval(() => {
      if (currentCoords?.lat && currentCoords?.lon) {
        fetchWeatherData(currentQuery, currentCoords.lat, currentCoords.lon, true);
      } else {
        fetchWeatherData(currentQuery, null, null, true);
      }
    }, 60000); // 60 seconds = 1 minute

    return () => clearInterval(interval);
  }, [autoRefresh, currentQuery, currentCoords]);

  const handleSearch = (searchTerm, lat = null, lon = null) => {
    setCity(searchTerm);
    if (lat && lon) {
      fetchWeatherData(`lat=${lat}&lon=${lon}`, lat, lon);
    } else if (searchTerm.trim()) {
      fetchWeatherData(`q=${searchTerm.trim()}`);
    }
  };

  const handleLocationClick = () => {
    // Show loading immediately
    setLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log('Location button clicked - Location:', { latitude, longitude });
          fetchWeatherData(`lat=${latitude}&lon=${longitude}`, latitude, longitude);
        },
        (error) => {
          console.log('Location button error:', error);
          setLoading(false);
          setError('location-not-found');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 // Force fresh location
        }
      );
    } else {
      setLoading(false);
      setError('location-not-found');
    }
  };

  const handleManualRefresh = () => {
    if (currentQuery) {
      if (currentCoords?.lat && currentCoords?.lon) {
        fetchWeatherData(currentQuery, currentCoords.lat, currentCoords.lon);
      } else {
        fetchWeatherData(currentQuery);
      }
    }
  };



  return (
    <div className={`App ${weatherClass}`}>
      <WeatherAnimation weatherType={weatherAnimation} />
      
      <motion.div 
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <motion.header 
          className="App-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h1 
            className="app-title"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <span>Weather&nbsp;Forecast</span>
          </motion.h1>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <SearchBar 
              onSearch={handleSearch} 
              onLocationClick={handleLocationClick}
              ref={(ref) => {
                if (ref) {
                  window.clearSearchInput = () => ref.clearSearchInput();
                }
              }}
            />
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSpinner />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={error === 'location-not-found' ? "location-not-found-container" : "city-not-found-container"}
              >
                <div className={error === 'location-not-found' ? "location-not-found-icon" : "city-not-found-icon"}>
                  {error === 'location-not-found' ? '📍' : '🌍'}
                </div>
                <h2 className={error === 'location-not-found' ? "location-not-found-title" : "city-not-found-title"}>
                  {error === 'location-not-found' ? 'Location Not Found' : 'City Not Found'}
                </h2>
                <p className={error === 'location-not-found' ? "location-not-found-message" : "city-not-found-message"}>
                  {error === 'location-not-found' 
                    ? "We couldn't access your location. Please enable location services or search for a city manually."
                    : error.includes('404') || error.includes('not found') 
                      ? "We couldn't find the city you're looking for. Please check the spelling and try again."
                      : error
                  }
                </p>
                
                <div className={error === 'location-not-found' ? "location-not-found-actions" : "city-not-found-actions"}>
                  {error === 'location-not-found' ? (
                    <>
                      <button 
                        className="location-not-found-button primary"
                        onClick={() => {
                          handleLocationClick();
                          setCity('');
                          if (window.clearSearchInput) {
                            window.clearSearchInput();
                          }
                        }}
                      >
                        🔄 Try Again
                      </button>
                      <button 
                        className="location-not-found-button secondary"
                        onClick={() => {
                          setError(null);
                          setCity('');
                          if (window.clearSearchInput) {
                            window.clearSearchInput();
                          }
                        }}
                      >
                        🔍 Search City
                      </button>
                    </>
                  ) : (
                    <button 
                      className="city-not-found-button"
                      onClick={() => {
                        handleLocationClick();
                        setCity('');
                        if (window.clearSearchInput) {
                          window.clearSearchInput();
                        }
                      }}
                    >
                      📍 Use My Location
                    </button>
                  )}
                </div>
              </motion.div>
            ) : weatherData ? (
              <motion.div
                key="weather"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Weather Alerts */}
                {alerts.length > 0 && (
                  <motion.div
                    className="weather-alerts"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <h3>⚠️ Weather Alerts</h3>
                    {alerts.map((alert, index) => (
                      <motion.div 
                        key={index} 
                        className="alert-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      >
                        <h4>{alert.event}</h4>
                        <p>{alert.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}


                
                {/* Current Weather */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Weather 
                    data={weatherData} 
                    lastUpdate={lastUpdate}
                    onManualRefresh={handleManualRefresh}
                    loading={loading}
                  />
                </motion.div>
                
                {/* Weather Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <WeatherDetails data={weatherData} forecastData={forecastData} />
                </motion.div>
                
                {/* Forecast */}
                {forecastData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                  >
                    <Forecast data={forecastData} />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="welcome-message"
              >
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Enter a city name to get weather information
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        {/* Copyright Footer */}
        <motion.footer
          className="copyright-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <p>
            © {new Date().getFullYear()} Weather App. Made with ❤️ for weather enthusiasts everywhere.
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}

export default App;
