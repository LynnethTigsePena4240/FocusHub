import { useEffect, useState } from "react";
import * as Location from "expo-location";

export type WeatherState = {
  temp: string;
  city: string;
  condition: string;
  isLoading: boolean;
  error: string | null;
};

const WEATHER_CODES = (code: number) => {
  if (code === 0) return { text: "Clear Sky", emoji: "☀️" };
  if (code > 0 && code <= 3) return { text: "Partly Cloudy", emoji: "🌤️" };
  if (code >= 45 && code <= 48) return { text: "Foggy", emoji: "🌫️" };
  if (code >= 51 && code <= 67) return { text: "Rain", emoji: "🌧️" };
  if (code >= 71 && code <= 77) return { text: "Snow", emoji: "❄️" };
  if (code >= 80 && code <= 82) return { text: "Rain Showers", emoji: "☔" };
  if (code >= 95 && code <= 99) return { text: "Thunderstorm", emoji: "⛈️" };
  return { text: "Unknown", emoji: "❓" };
};

export const useWeather = () => {
  const [state, setState] = useState<WeatherState>({
    temp: "...",
    city: "",
    condition: "",
    isLoading: true,
    error: null,
  });

  const fetchCityName = async (lat: number, lon: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10`;
      const response = await fetch(url, {
        headers: { "User-Agent": "WeatherApp/1.0" },
      });
      const data = await response.json();
      return (
        data?.address?.city ||
        "Unknown"
      );
    } catch {
      return "Unknown";
    }
  };

  const fetchWeather = async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Location permission denied");

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Fetch city name
      const cityName = await fetchCityName(latitude, longitude);

      // Fetch weather
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch weather");

      const data = await response.json();
      const weather = data.current_weather;
      const currentWeather = Math.round(weather.temperature);

      const interpreted = WEATHER_CODES(weather.weathercode);

      setState({
        temp: `${currentWeather}°C`,
        city: cityName,
        condition: `${interpreted.text} ${interpreted.emoji}`,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      setState((s) => ({
        ...s,
        error: err.message || "Unknown error",
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return state;
};
