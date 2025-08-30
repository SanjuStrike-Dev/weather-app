import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, isToday, isAfter, startOfDay } from 'date-fns';

function Forecast({ data }) {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!data || !data.list) return null;

  // Group forecast data by day
  const dailyForecasts = data.list.reduce((acc, item) => {
    const date = format(parseISO(item.dt_txt), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  const dailyData = Object.entries(dailyForecasts).map(([date, items]) => {
    const avgTemp = Math.round(
      items.reduce((sum, item) => sum + item.main.temp, 0) / items.length
    );
    const minTemp = Math.round(Math.min(...items.map(item => item.main.temp_min)));
    const maxTemp = Math.round(Math.max(...items.map(item => item.main.temp_max)));
    const avgHumidity = Math.round(
      items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length
    );
    const avgWindSpeed = Math.round(
      items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length * 3.6
    );
    
    const mostFrequentWeather = items.reduce((acc, item) => {
      const weather = item.weather[0].main;
      acc[weather] = (acc[weather] || 0) + 1;
      return acc;
    }, {});
    const dominantWeather = Object.keys(mostFrequentWeather).reduce((a, b) => 
      mostFrequentWeather[a] > mostFrequentWeather[b] ? a : b
    );
    const weatherIcon = items.find(item => item.weather[0].main === dominantWeather)?.weather[0].icon;

    return {
      date,
      dayName: format(parseISO(date), 'EEE'),
      fullDate: format(parseISO(date), 'MMM dd'),
      isToday: isToday(parseISO(date)),
      avgTemp,
      minTemp,
      maxTemp,
      avgHumidity,
      avgWindSpeed,
      weather: dominantWeather,
      icon: weatherIcon,
      items
    };
  });

  // Sort to put today first
  dailyData.sort((a, b) => {
    if (a.isToday) return -1;
    if (b.isToday) return 1;
    return new Date(a.date) - new Date(b.date);
  });

  // Use only real API data - 5 days
  const displayData = dailyData;
  const todayData = dailyData.find(day => day.isToday);
  
  // Filter out today and only show future days
  const upcomingDays = displayData.filter(day => {
    const dayDate = parseISO(day.date);
    const today = startOfDay(new Date());
    return isAfter(dayDate, today);
  });

  // Get all hourly data for today from API
  const getTodayHourlyData = () => {
    if (!todayData) return [];
    
    // Return all hourly data from today (no filtering)
    return todayData.items;
  };

  const todayHourlyData = getTodayHourlyData();

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

  const getWeatherIconClass = (iconCode, weather) => {
    const desc = weather.toLowerCase();
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

  const selectedDayData = displayData[selectedDay];

  return (
    <motion.div 
      className="forecast-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="forecast-header">
        <h3 className="forecast-title">Upcoming Days</h3>
      </div>

      {/* Today's Forecast - Prominent Display */}
      {/* {todayData && (
        <motion.div
          className="today-forecast today-forecast-green"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="today-forecast-header">
            <h4 className="today-forecast-title">Today's Forecast</h4>
            <span className="today-forecast-date">{todayData.fullDate}</span>
          </div>
          
          <div className="today-forecast-content">
            <div className="today-forecast-main">
              <div className="today-forecast-temp">{todayData.avgTemp}°</div>
              <div className="today-forecast-desc">{todayData.weather}</div>
            </div>
            
            <div className="today-forecast-icon">
              {getWeatherIcon(todayData.icon)}
            </div>
            
            <div className="today-forecast-details">
              <div className="today-forecast-detail">
                <span className="today-forecast-detail-label">High</span>
                <span className="today-forecast-detail-value">{todayData.maxTemp}°</span>
              </div>
              <div className="today-forecast-detail">
                <span className="today-forecast-detail-label">Low</span>
                <span className="today-forecast-detail-value">{todayData.minTemp}°</span>
              </div>
              <div className="today-forecast-detail">
                <span className="today-forecast-detail-label">Humidity</span>
                <span className="today-forecast-detail-value">{todayData.avgHumidity}%</span>
              </div>
              <div className="today-forecast-detail">
                <span className="today-forecast-detail-label">Wind</span>
                <span className="today-forecast-detail-value">{todayData.avgWindSpeed} km/h</span>
              </div>
            </div>
          </div>
        </motion.div>
      )} */}

      {/* Upcoming Days Forecast - Clean 5-Day UI */}
      {upcomingDays.length > 0 && (
        <>
          <div className="forecast-days">
            {upcomingDays.map((day, index) => (
              <motion.div
                key={day.date}
                className={`forecast-day ${selectedDay === index + 1 ? 'selected' : ''}`}
                onClick={() => setSelectedDay(index + 1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="day-name">{day.dayName}</div>
                <div className="day-date">{day.fullDate}</div>
                <div className={`day-icon ${getWeatherIconClass(day.icon, day.weather)}`}>
                  {getWeatherIcon(day.icon)}
                </div>
                <div className="day-temp">{day.avgTemp}°</div>
                <div className="day-desc">{day.weather}</div>
                <div className="day-details">
                  <div className="temp-range">
                    <div>
                      <span className="temp-label">Max:</span>
                      <span className="high">{day.maxTemp}°</span>
                    </div>
                    <div>
                      <span className="temp-label">Min:</span>
                      <span className="low">{day.minTemp}°</span>
                    </div>
                  </div>
                  <div className="humidity">💧 {day.avgHumidity}%</div>
                  <div className="wind">💨 {day.avgWindSpeed} km/h</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="forecast-note">
            *Different colors and stars are used for visual appeal and better user experience
          </div>
        </>
      )}

    </motion.div>
  );
}

export default Forecast;
