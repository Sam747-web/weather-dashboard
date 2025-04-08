import { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const API_KEY = dc75f8a76ff873826044d9b7eafbdce9; 

  const fetchWeather = async () => {
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      const dailyForecast = forecastResponse.data.list.filter((_, index) => index % 8 === 0);
      setForecast(dailyForecast);
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-4 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Weather Dashboard</h1>

      <div className="w-full max-w-md flex gap-2">
        <input
          type="text"
          placeholder="Enter city name"
          className="flex-1 p-2 rounded-lg shadow-md"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {weather && (
        <div className="bg-white rounded-xl shadow-md mt-6 p-6 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold">{weather.name}</h2>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
            className="mx-auto"
          />
          <p className="text-2xl">{weather.main.temp}°C</p>
          <p className="capitalize">{weather.weather[0].description}</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-lg font-bold mb-2 text-blue-700">5-Day Forecast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md text-center"
              >
                <p className="font-semibold">
                  {new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="forecast icon"
                  className="mx-auto"
                />
                <p>{day.main.temp.toFixed(0)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
