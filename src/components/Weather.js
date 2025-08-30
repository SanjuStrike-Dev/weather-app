import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { WiHumidity, WiStrongWind, WiBarometer, WiThermometer } from 'react-icons/wi';

function Weather({ data }) {
  if (!data || !data.main || !data.weather) {
    return <p>No weather data available</p>;
  }

  const tempCelsius = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const humidity = data.main.humidity;
  const windSpeed = Math.round(data.wind?.speed * 3.6); // Convert m/s to km/h
  const pressure = data.main.pressure;
  const visibility = data.visibility ? Math.round(data.visibility / 1000) : null; // Convert to km

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

  const getTemperatureColor = (iconCode, description) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear') || desc.includes('sunny') || iconCode.includes('01')) {
      return '#f59e0b'; // Sunny - Yellow/Orange
    } else if (desc.includes('cloud') || desc.includes('overcast') || iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) {
      return '#64748b'; // Cloudy - Gray
    } else if (desc.includes('rain') || desc.includes('drizzle') || iconCode.includes('09') || iconCode.includes('10')) {
      return '#0891b2'; // Rainy - Blue
    } else if (desc.includes('snow') || desc.includes('sleet') || iconCode.includes('13')) {
      return '#3b82f6'; // Snowy - Light Blue
    } else if (desc.includes('thunder') || desc.includes('storm') || iconCode.includes('11')) {
      return '#7c3aed'; // Stormy - Purple
    } else if (desc.includes('fog') || desc.includes('mist') || iconCode.includes('50')) {
      return '#94a3b8'; // Foggy - Light Gray
    }
    return '#059669'; // Default - Green
  };

  const getFeelsLikeColor = (feelsLike) => {
    return '#666'; // Consistent gray color
  };

  const getWeatherDescriptionColor = (description) => {
    return '#333'; // Consistent dark gray color
  };

  const getWeatherIconClass = (iconCode, description) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear') || desc.includes('sunny') || iconCode.includes('01')) {
      return 'sunny';
    } else if (desc.includes('cloud') || desc.includes('overcast') || iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) {
      return 'cloudy';
    } else if (desc.includes('rain') || desc.includes('drizzle') || iconCode.includes('09') || iconCode.includes('10')) {
      return 'rainy';
    } else if (desc.includes('snow') || desc.includes('sleet') || iconCode.includes('13')) {
      return 'snowy';
    } else if (desc.includes('thunder') || desc.includes('storm') || iconCode.includes('11')) {
      return 'stormy';
    } else if (desc.includes('fog') || desc.includes('mist') || iconCode.includes('50')) {
      return 'foggy';
    }
    return ''; // Default floating animation
  };

  return (
    <motion.div 
      className="weather-card"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className="weather-header"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div 
          className="location-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.h2 
            className="city-name"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            {data.name}
          </motion.h2>
          <motion.p 
            className="country"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {data.sys?.country}
          </motion.p>
          <motion.p 
            className="date-time"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            {format(new Date(), 'EEEE, MMMM do')} • {format(new Date(), 'h:mm a')}
          </motion.p>
        </motion.div>
        <motion.div 
          className="weather-icon-container"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            transition: { duration: 0.3 }
          }}
        >
          <span className={`weather-emoji ${getWeatherIconClass(icon, description)}`}>
            {getWeatherIcon(icon)}
          </span>
        </motion.div>
      </motion.div>

      <motion.div 
        className="temperature-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <motion.div 
          className="main-temp"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.span 
            className="temp-value"
            style={{ color: getTemperatureColor(icon, description) }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {tempCelsius}
          </motion.span>
          <motion.span 
            className="temp-unit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            °C
          </motion.span>
        </motion.div>
        <motion.div 
          className="temp-details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <motion.p 
            className="feels-like"
            style={{ color: getFeelsLikeColor(feelsLike) }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            Feels like {feelsLike}°C
          </motion.p>
          <motion.p 
            className="weather-description"
            style={{ color: getWeatherDescriptionColor(description) }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            {description}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* <div className="weather-stats">
        <div className="stat-item">
          <WiHumidity className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">{humidity}%</span>
            <span className="stat-label">Humidity</span>
          </div>
        </div>
        
        <div className="stat-item">
          <WiStrongWind className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">{windSpeed} km/h</span>
            <span className="stat-label">Wind Speed</span>
          </div>
        </div>
        
        <div className="stat-item">
          <WiBarometer className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">{pressure} hPa</span>
            <span className="stat-label">Pressure</span>
          </div>
        </div>
        
        {visibility && (
          <div className="stat-item">
            <WiThermometer className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">{visibility} km</span>
              <span className="stat-label">Visibility</span>
            </div>
          </div>
        )}
      </div> */}
    </motion.div>
  );
}

export default Weather;
