import React from 'react';
import { motion } from 'framer-motion';

function WeatherAnimation({ weatherType }) {
  const getWeatherAnimation = () => {
    switch (weatherType) {
      case 'rain':
        return (
          <div className="weather-animation rain">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="raindrop"
                initial={{ y: -100, opacity: 0 }}
                animate={{ 
                  y: window.innerHeight + 100, 
                  opacity: [0, 1, 0] 
                }}
                transition={{
                  duration: Math.random() * 1 + 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        );

      case 'snow':
        return (
          <div className="weather-animation snow">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="snowflake"
                initial={{ y: -50, opacity: 0, x: 0 }}
                animate={{ 
                  y: window.innerHeight + 50, 
                  opacity: [0, 1, 0],
                  x: Math.random() * 100 - 50
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 10 + 10}px`
                }}
              >
                ❄
              </motion.div>
            ))}
          </div>
        );

      case 'clouds':
        return (
          <div className="weather-animation clouds">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="cloud"
                initial={{ x: -200, opacity: 0 }}
                animate={{ 
                  x: window.innerWidth + 200, 
                  opacity: [0, 0.8, 0] 
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                  ease: "linear"
                }}
                style={{
                  top: `${Math.random() * 60 + 10}%`,
                  fontSize: `${Math.random() * 40 + 60}px`
                }}
              >
                ☁️
              </motion.div>
            ))}
          </div>
        );

      case 'sun':
        return (
          <div className="weather-animation sun">
            <motion.div
              className="sun-glow"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="sun-ray"
                style={{
                  transform: `rotate(${i * 45}deg)`
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );

      case 'storm':
        return (
          <div className="weather-animation storm">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="lightning"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0] 
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60 + 20}%`
                }}
              >
                ⚡
              </motion.div>
            ))}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`rain-${i}`}
                className="raindrop heavy"
                initial={{ y: -100, opacity: 0 }}
                animate={{ 
                  y: window.innerHeight + 100, 
                  opacity: [0, 1, 0] 
                }}
                transition={{
                  duration: Math.random() * 0.8 + 0.3,
                  repeat: Infinity,
                  delay: Math.random() * 1,
                  ease: "linear"
                }}
                style={{
                  left: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="weather-animation-container">
      {getWeatherAnimation()}
    </div>
  );
}

export default WeatherAnimation;
