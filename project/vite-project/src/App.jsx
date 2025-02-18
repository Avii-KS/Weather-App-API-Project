import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  WiHumidity,
  WiStrongWind,
  WiThermometer,
  WiBarometer,
} from "react-icons/wi";
import { FiSearch, FiAlertCircle } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import "./App.css";

function Stars() {
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.5 + 0.3,
  }));

  return (
    <div className="stars">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            "--duration": `${star.duration}s`,
            "--opacity": star.opacity,
          }}
        />
      ))}
    </div>
  );
}

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("London");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=177dfccbce7740c0bee35031251802&q==${cityName}&aqi=yes
`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <>
      <Stars />
      <div className="weather-app">
        <motion.form
          onSubmit={handleSubmit}
          className="search-form"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="city-input"
          />
          <button type="submit" className="search-button">
            <FiSearch />
          </button>
        </motion.form>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BiLoaderAlt className="loading-spinner" size={24} />
              Loading...
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              className="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <FiAlertCircle size={24} />
              {error}
            </motion.div>
          ) : (
            weatherData && (
              <motion.div
                key="weather"
                className="weather-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="location">
                  {weatherData.location.name}, {weatherData.location.country}
                </h2>
                <div className="weather-info">
                  <motion.img
                    src={weatherData.current.condition.icon}
                    alt={weatherData.current.condition.text}
                    className="weather-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                  <motion.div
                    className="temperature"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {weatherData.current.temp_c}°C
                  </motion.div>
                </div>
                <motion.div
                  className="condition"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {weatherData.current.condition.text}
                </motion.div>
                <motion.div
                  className="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="detail-item">
                    <WiThermometer size={24} />
                    <span>Feels like:</span> {weatherData.current.feelslike_c}°C
                  </div>
                  <div className="detail-item">
                    <WiHumidity size={24} />
                    <span>Humidity:</span> {weatherData.current.humidity}%
                  </div>
                  <div className="detail-item">
                    <WiStrongWind size={24} />
                    <span>Wind:</span> {weatherData.current.wind_kph} km/h
                  </div>
                  {weatherData.current.air_quality && (
                    <div className="detail-item">
                      <WiBarometer size={24} />
                      <span>Air Quality (PM2.5):</span>{" "}
                      {weatherData.current.air_quality.pm2_5.toFixed(1)}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
