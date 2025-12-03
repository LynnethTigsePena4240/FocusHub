import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

interface WeatherData {
    temp: number;
    weatherCode: number;
    city: string;
}

const getWeatherDescription = (code: number) => {
    if (code === 0) return { text: 'Clear Sky', emoji: '☀️' };
    if (code > 0 && code <= 3) return { text: 'Partly Cloudy', emoji: '🌤️' };
    if (code >= 45 && code <= 48) return { text: 'Foggy', emoji: '🌫️' };
    if (code >= 51 && code <= 67) return { text: 'Rain', emoji: '🌧️' };
    if (code >= 71 && code <= 77) return { text: 'Snow', emoji: '❄️' };
    if (code >= 80 && code <= 82) return { text: 'Rain Showers', emoji: '☔' };
    if (code >= 95 && code <= 99) return { text: 'Thunderstorm', emoji: '⛈️' };
    return { text: 'Unknown', emoji: '❓' };
};

const getCityNameFromNominatim = async (latitude: number, longitude: number): Promise<string | null> => {
    const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/reverse';
    const geocodeUrl = `${NOMINATIM_API_URL}?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`;

    try {
        const response = await fetch(geocodeUrl, {
            headers: {
                'User-Agent': 'FocusHubWeatherApp/1.0 (contact@example.com)'
            }
        });
        const json = await response.json();

        if (json.address) {
            return json.address.city || json.address.town || json.address.village || json.address.country;
        }
    } catch (e) {
        return null;
    }
    return null;
};

export default function WeatherScreen() {
    const colorScheme = useColorScheme();

    const isDarkMode = colorScheme === 'dark';
    const colors = {
        background: isDarkMode ? '#121212' : '#F0F0F0',
        text: isDarkMode ? '#FFFFFF' : '#333333',
        card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        primary: '#007AFF',
        error: '#CF6679',
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);

        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Permission to access location was denied. Please enable it in settings.');
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            const locationDetails = await Location.reverseGeocodeAsync({ latitude, longitude });
            let city = locationDetails[0]?.city || locationDetails[0]?.name;

            if (!city) {
                city = await getCityNameFromNominatim(latitude, longitude);
            }

            const finalCity = city || 'Location Unknown';

            const weatherUrl =
                `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=auto&forecast_days=1`;

            const response = await fetch(weatherUrl);
            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.reason || `API Error: Status ${response.status}`);
            }

            if (json.current) {
                setWeather({
                    temp: Math.round(json.current.temperature_2m),
                    weatherCode: json.current.weather_code,
                    city: finalCity,
                });
            } else {
                setError('Could not parse weather data from API response.');
            }

        } catch (e) {
            setError((e as Error).message || 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    const weatherDisplay = weather ? getWeatherDescription(weather.weatherCode) : { text: '', emoji: '' };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Weather in Your Area</Text>

            <Button
                title={loading ? "Fetching..." : "Refresh Weather"}
                onPress={fetchWeather}
                disabled={loading}
                color={colors.primary}
            />

            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : error ? (
                    <Text style={[styles.errorText, { color: colors.error }]}>Error: {error}</Text>
                ) : weather ? (
                    <View style={[styles.weatherCard, { backgroundColor: colors.card }]}>
                        <Text style={[styles.cityText, { color: colors.text }]}>{weather.city}</Text>
                        <Text style={[styles.tempText, { color: colors.primary }]}>{weather.temp}°C</Text>
                        <Text style={[styles.conditionText, { color: colors.text }]}>
                            {weatherDisplay.text}
                        </Text>
                        <Text style={{ fontSize: 48, marginTop: 10 }}>
                            {weatherDisplay.emoji}
                        </Text>
                    </View>
                ) : (
                    <Text style={{ color: colors.text }}>Press the button to get the weather.</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 70,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    weatherCard: {
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    cityText: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 5,
    },
    tempText: {
        fontSize: 72,
        fontWeight: '300',
        marginBottom: 5,
    },
    conditionText: {
        fontSize: 18,
        fontWeight: '400',
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
    }
});