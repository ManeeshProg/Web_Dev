import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setLoading] = useState(false); // For loading state

  const apiKey = '522a2e0f5cceccd717048f7d5b325fae'; // Your OpenWeatherMap API key

  const getCurrentLocationWeather = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        setWeatherData(data);

        // Trigger notification for current location weather
        if (Notification.permission === 'granted') {
          new Notification('Weather Update', {
            body: `The current temperature is ${data.main.temp}°C in your area`,
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('Weather Update', {
                body: `The current temperature is ${data.main.temp}°C in your area`,
              });
            }
          });
        }
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const getWeather = async () => {
    if (!city) {
      setError('Please enter a city name.');
      setWeatherData(null);
      return;
    }

    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod === "404") {
        setError('City not found. Try again.');
        setWeatherData(null);
      } else {
        setWeatherData(data);
        setError('');
        // Trigger notification after data is successfully fetched
        if (Notification.permission === 'granted') {
          new Notification('Weather Update', {
            body: `The current temperature in ${data.name} is ${data.main.temp}°C`,
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('Weather Update', {
                body: `The current temperature in ${data.name} is ${data.main.temp}°C`,
              });
            }
          });
        }
      }
    } catch (err) {
      setError('Something went wrong. Try again later.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const iconCode = weatherData?.weather[0]?.icon;
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? '🌞' : '🌙'}
      </button>

      <h1>Weather App</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Get Weather</button>
      </div>

      {isLoading && <div className="spinner">Loading...</div>} {/* Loading indicator */}

      {error && <p className="error">{error}</p>}

      {weatherData && weatherData.sys && (
        <div className="weather">
          {iconUrl && <img src={iconUrl} alt="weather icon" />}
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <h3>{weatherData.weather[0].description}</h3>
          <p>🌡 Temp: {weatherData.main.temp}°C</p>
          <p>💧 Humidity: {weatherData.main.humidity}%</p>
          <p>🌬 Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}

      {/* Button to get weather based on current location */}
      <button onClick={getCurrentLocationWeather}>Get Current Location Weather</button>
    </div>
  );
};

export default App;
