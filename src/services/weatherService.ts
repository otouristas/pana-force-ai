import { supabase } from "@/integrations/supabase/client";

export interface WeatherData {
  temperature_celsius: number;
  feels_like_celsius: number;
  humidity_percent: number;
  wind_speed_kmh: number;
  wind_direction: string;
  precipitation_mm: number;
  weather_condition: string;
  pressure_hpa: number;
  visibility_km: number;
  uv_index: number;
}

export interface WeatherImpact {
  performance_modifier: number;
  risk_level: 'low' | 'medium' | 'high';
  recommendations: string[];
  factors: {
    temperature_impact: number;
    humidity_impact: number;
    wind_impact: number;
    precipitation_impact: number;
  };
}

export const weatherService = {
  async fetchWeatherForMatch(matchId: string): Promise<WeatherData | null> {
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .eq('match_id', matchId)
      .eq('is_forecast', false)
      .maybeSingle();

    if (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }

    return data;
  },

  async fetchWeatherForecast(matchId: string): Promise<WeatherData | null> {
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .eq('match_id', matchId)
      .eq('is_forecast', true)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching weather forecast:', error);
      return null;
    }

    return data;
  },

  async fetchWeatherForLocation(city: string, country: string): Promise<WeatherData | null> {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

      if (!apiKey) {
        console.warn('OpenWeather API key not configured, using mock data');
        return this.getMockWeatherData();
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();

      return {
        temperature_celsius: data.main.temp,
        feels_like_celsius: data.main.feels_like,
        humidity_percent: data.main.humidity,
        wind_speed_kmh: data.wind.speed * 3.6,
        wind_direction: this.getWindDirection(data.wind.deg),
        precipitation_mm: data.rain?.['1h'] || 0,
        weather_condition: data.weather[0].main,
        pressure_hpa: data.main.pressure,
        visibility_km: (data.visibility || 10000) / 1000,
        uv_index: 5,
      };
    } catch (error) {
      console.error('Error fetching weather from API:', error);
      return this.getMockWeatherData();
    }
  },

  async saveWeatherData(matchId: string, weatherData: WeatherData, isForecast: boolean = false) {
    const { error } = await supabase
      .from('weather_data')
      .insert({
        match_id: matchId,
        ...weatherData,
        is_forecast: isForecast,
      });

    if (error) {
      console.error('Error saving weather data:', error);
      throw error;
    }
  },

  analyzeWeatherImpact(weather: WeatherData): WeatherImpact {
    let performanceModifier = 1.0;
    const recommendations: string[] = [];

    const tempImpact = this.calculateTemperatureImpact(weather.temperature_celsius);
    const humidityImpact = this.calculateHumidityImpact(weather.humidity_percent);
    const windImpact = this.calculateWindImpact(weather.wind_speed_kmh);
    const precipitationImpact = this.calculatePrecipitationImpact(weather.precipitation_mm);

    performanceModifier = 1 + tempImpact + humidityImpact + windImpact + precipitationImpact;

    if (weather.temperature_celsius > 30) {
      recommendations.push('High temperature: Increase hydration protocols');
      recommendations.push('Consider additional cooling breaks');
    } else if (weather.temperature_celsius < 5) {
      recommendations.push('Cold conditions: Extended warm-up recommended');
      recommendations.push('Monitor muscle injury risk');
    }

    if (weather.humidity_percent > 80) {
      recommendations.push('High humidity: Reduce high-intensity duration');
    }

    if (weather.wind_speed_kmh > 30) {
      recommendations.push('Strong winds: Adjust passing strategy');
      recommendations.push('Consider tactical modifications');
    }

    if (weather.precipitation_mm > 5) {
      recommendations.push('Wet conditions: Focus on ball control');
      recommendations.push('Adjust tackling technique');
    }

    const riskLevel = this.calculateRiskLevel(performanceModifier);

    return {
      performance_modifier: performanceModifier,
      risk_level: riskLevel,
      recommendations,
      factors: {
        temperature_impact: tempImpact,
        humidity_impact: humidityImpact,
        wind_impact: windImpact,
        precipitation_impact: precipitationImpact,
      },
    };
  },

  calculateTemperatureImpact(temp: number): number {
    if (temp >= 20 && temp <= 25) return 0;
    if (temp > 25) return -0.02 * (temp - 25);
    if (temp < 20) return -0.015 * (20 - temp);
    return 0;
  },

  calculateHumidityImpact(humidity: number): number {
    if (humidity <= 60) return 0;
    return -0.001 * (humidity - 60);
  },

  calculateWindImpact(windSpeed: number): number {
    if (windSpeed <= 20) return 0;
    return -0.005 * (windSpeed - 20);
  },

  calculatePrecipitationImpact(precipitation: number): number {
    if (precipitation === 0) return 0;
    return -0.03 * Math.min(precipitation, 10);
  },

  calculateRiskLevel(modifier: number): 'low' | 'medium' | 'high' {
    if (modifier >= 0.95) return 'low';
    if (modifier >= 0.85) return 'medium';
    return 'high';
  },

  getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  },

  getMockWeatherData(): WeatherData {
    return {
      temperature_celsius: 22,
      feels_like_celsius: 21,
      humidity_percent: 65,
      wind_speed_kmh: 15,
      wind_direction: 'SW',
      precipitation_mm: 0,
      weather_condition: 'Clear',
      pressure_hpa: 1013,
      visibility_km: 10,
      uv_index: 6,
    };
  },

  getWeatherIcon(condition: string): string {
    const iconMap: Record<string, string> = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Drizzle: '🌦️',
      Thunderstorm: '⛈️',
      Snow: '❄️',
      Mist: '🌫️',
      Fog: '🌫️',
    };
    return iconMap[condition] || '☀️';
  },
};
