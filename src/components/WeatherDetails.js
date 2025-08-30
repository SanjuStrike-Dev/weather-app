import React from 'react';
import { motion } from 'framer-motion';
import { WiSunrise, WiSunset, WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi';
import { format, parseISO } from 'date-fns';

function WeatherDetails({ data, forecastData }) {
  if (!data) return null;

  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  const humidity = data.main.humidity;
  const windSpeed = Math.round(data.wind?.speed * 3.6);
  const windDeg = data.wind?.deg;
  const pressure = data.main.pressure;
  const visibility = data.visibility ? Math.round(data.visibility / 1000) : null;

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  // Get today's hourly data from forecast
  const getTodayHourlyData = () => {
    if (!forecastData || !forecastData.list) return [];
    
    // Group forecast data by day
    const dailyForecasts = forecastData.list.reduce((acc, item) => {
      const date = format(parseISO(item.dt_txt), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    // Get today's data
    const today = format(new Date(), 'yyyy-MM-dd');
    return dailyForecasts[today] || [];
  };

  const todayHourlyData = getTodayHourlyData();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="weather-details"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="details-title">Weather Details</h3>
      
      <div className="details-grid">
        <motion.div className="detail-card" variants={itemVariants}>
          <div className="detail-icon">
            <WiSunrise />
          </div>
          <div className="detail-content">
            <span className="detail-label">Sunrise</span>
            <span className="detail-value">{format(sunrise, 'h:mm a')}</span>
          </div>
        </motion.div>

        <motion.div className="detail-card" variants={itemVariants}>
          <div className="detail-icon">
            <WiSunset />
          </div>
          <div className="detail-content">
            <span className="detail-label">Sunset</span>
            <span className="detail-value">{format(sunset, 'h:mm a')}</span>
          </div>
        </motion.div>

        <motion.div className="detail-card" variants={itemVariants}>
          <div className="detail-icon">
            <WiHumidity />
          </div>
          <div className="detail-content">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{humidity}%</span>
          </div>
        </motion.div>

        <motion.div className="detail-card" variants={itemVariants}>
          <div className="detail-icon">
            <WiStrongWind />
          </div>
          <div className="detail-content">
            <span className="detail-label">Wind</span>
            <span className="detail-value">
              {windSpeed} km/h {windDeg && getWindDirection(windDeg)}
            </span>
          </div>
        </motion.div>

        <motion.div className="detail-card" variants={itemVariants}>
          <div className="detail-icon">
            <WiBarometer />
          </div>
          <div className="detail-content">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{pressure} hPa</span>
          </div>
        </motion.div>

        {visibility && (
          <motion.div className="detail-card" variants={itemVariants}>
            <div className="detail-icon">
              <WiBarometer />
            </div>
            <div className="detail-content">
              <span className="detail-label">Visibility</span>
              <span className="detail-value">{visibility} km</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Today's Hourly Forecast */}
      {todayHourlyData.length > 0 && (
        <motion.div 
          className="hourly-forecast"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="hourly-title">Today's Hourly Forecast</h4>
          <div className="hourly-scroll">
            {todayHourlyData.map((item, index) => {
              const hour = new Date(item.dt_txt).getHours();
              
              // Get time-appropriate icon based on hour
              const getTimeIcon = (hour) => {
                if (hour >= 5 && hour < 7) return '🌅'; // Early morning
                if (hour >= 7 && hour < 10) return '☀️'; // Morning
                if (hour >= 10 && hour < 12) return '🌤️'; // Mid-morning
                if (hour >= 12 && hour < 15) return '🌞'; // Noon
                if (hour >= 15 && hour < 17) return '🌆'; // Afternoon
                if (hour >= 17 && hour < 19) return '🌇'; // Evening
                if (hour >= 19 && hour < 21) return '🌆'; // Late evening
                if (hour >= 21 && hour < 23) return '🌙'; // Night
                if (hour >= 23 || hour < 5) return '🌃'; // Late night
                return '⏰'; // Default
              };

              return (
                <motion.div
                  key={index}
                  className="hourly-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="hour-time">
                    {format(parseISO(item.dt_txt), 'h:mm a')}
                  </div>
                  <div className="hour-icon">
                    {getTimeIcon(hour)}
                  </div>
                  <div className="hour-temp">
                    {Math.round(item.main.temp)}°
                  </div>
                  <div className="hour-feels-like">
                    Feels {Math.round(item.main.feels_like)}°
                  </div>
                  <div className="hour-desc">
                    {item.weather[0].description}
                  </div>
                  <div className="hour-details">
                    <div className="hour-humidity">
                      💧 {item.main.humidity}%
                    </div>
                    <div className="hour-wind">
                      💨 {Math.round(item.wind.speed * 3.6)} km/h
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="hourly-note">
            *Hourly forecast data available subject to the availability
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default WeatherDetails;
