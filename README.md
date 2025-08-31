# Weather Forecast App

A beautiful, modern weather application built with React that provides comprehensive weather information with an elegant user interface.

## ✨ Features

### 🌟 Modern Design
- **Glassmorphism UI** with backdrop blur effects
- **Dynamic backgrounds** that change based on weather conditions
- **Smooth animations** powered by Framer Motion
- **Responsive design** that works on all devices
- **Modern typography** with Poppins font family

### 🌤️ Weather Information
- **Current weather** with detailed temperature and conditions
- **5-day forecast** with daily weather predictions
- **Weather details** including humidity, wind speed, pressure, and visibility
- **Dynamic weather icons** with weather-specific animations
- **Smart color coding** based on weather conditions

### 🔍 Smart Search & Location
- **Modern search bar** with location icon
- **Geolocation support** for automatic location detection
- **City search** with real-time weather updates
- **Enhanced error handling** with helpful suggestions

### 📱 User Experience
- **Loading animations** with weather-themed spinners
- **Smooth transitions** between different weather states
- **Interactive elements** with hover effects
- **Weather-specific animations** for icons and elements

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **Framer Motion** - Smooth animations and transitions
- **Date-fns** - Date formatting and manipulation
- **Lucide React** - Modern icon library
- **CSS3** - Advanced styling with glassmorphism effects

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🔑 API Configuration

The app uses the OpenWeatherMap API. You'll need to:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Replace the API key in `src/services/weatherService.js`:
```javascript
const API_KEY = 'your-api-key-here';
```

## 📱 Available Scripts

### Development
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

### Code Review & Maintenance
- `npm run review` - Comprehensive code review (unused imports, dependencies, and interactive checks)
- `npm run review:imports` - Remove unused imports from source files using ESLint
- `npm run review:deps` - Check for unused dependencies in package.json
- `npm run review:check` - Interactive dependency management (like npm review)
- `npm run review:check-interactive` - Interactive mode for dependency updates
- `npm run clean:imports` - Clean up unused imports (same as review:imports)
- `npm run check:imports` - Check for unused imports without removing them
- `npm run check:deps` - Check dependencies in JSON format
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Run ESLint and automatically fix issues

## 🎨 Key Features

### Weather Cards
- **Current Weather**: Displays temperature with dynamic colors, feels like, description, and animated weather icon
- **Weather Details**: Shows humidity, wind speed, pressure, and visibility
- **City Information**: Location with glowing title and current date/time

### Forecast System
- **5-Day Forecast**: Colorful cards with weather-specific animations
- **Interactive Design**: Hover effects and smooth transitions
- **Weather-Based Colors**: Day names and icons match weather themes

### Smart Location
- **GPS Integration**: Accurate location detection
- **Manual Search**: City name search functionality
- **Error Handling**: User-friendly error messages with suggestions

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide React](https://lucide.dev/)