import React from 'react';
import { motion } from 'framer-motion';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <motion.div
        className="loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </motion.div>
      <motion.p
        className="loading-text"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading weather data...
      </motion.p>
    </div>
  );
}

export default LoadingSpinner;
