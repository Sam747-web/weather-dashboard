import { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchWeather = async () => {
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      setWeather(weatherRes.data);
      // Filter forecast to get one result per day (every 24h = 8 * 3h blocks)
      const dailyForecast = forecastRes.data.list.filter((_, i) => i % 8 === 0);
      setForecast(dailyForecast);
    } catch (error) {
      console.error("Error fetching data:", error);
      setWeather(null);
      setForecast([]);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-4 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Weather Dashboard</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400"
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {weather && (
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md text-center mb-6">
          <h2 className="text-2xl font-semibold">{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
            className="mx-auto"
          />
          <p className="text-xl">{weather.main.temp}°C</p>
          <p className="capitalize text-gray-600">{weather.weather[0].description}</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {forecast.map((day, i) => (
              <div
                key={i}
                className="bg-white shadow rounded-lg p-3 text-center"
              >
                <p className="text-sm">{new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt="forecast icon"
                  className="mx-auto"
                />
                <p className="text-sm">{day.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
