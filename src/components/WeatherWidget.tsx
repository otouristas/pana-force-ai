import { Card } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Eye, Thermometer } from "lucide-react";
import { weatherService, WeatherData, WeatherImpact } from "@/services/weatherService";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface WeatherWidgetProps {
  matchId?: string;
  city?: string;
  country?: string;
  showImpactAnalysis?: boolean;
  compact?: boolean;
}

export const WeatherWidget = ({
  matchId,
  city,
  country,
  showImpactAnalysis = true,
  compact = false
}: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [impact, setImpact] = useState<WeatherImpact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        let weatherData: WeatherData | null = null;

        if (matchId) {
          weatherData = await weatherService.fetchWeatherForMatch(matchId);
          if (!weatherData) {
            weatherData = await weatherService.fetchWeatherForecast(matchId);
          }
        } else if (city && country) {
          weatherData = await weatherService.fetchWeatherForLocation(city, country);
        }

        if (weatherData) {
          setWeather(weatherData);
          if (showImpactAnalysis) {
            const impactAnalysis = weatherService.analyzeWeatherImpact(weatherData);
            setImpact(impactAnalysis);
          }
        } else {
          const mockData = weatherService.getMockWeatherData();
          setWeather(mockData);
          if (showImpactAnalysis) {
            setImpact(weatherService.analyzeWeatherImpact(mockData));
          }
        }
      } catch (error) {
        console.error('Error loading weather:', error);
        const mockData = weatherService.getMockWeatherData();
        setWeather(mockData);
        if (showImpactAnalysis) {
          setImpact(weatherService.analyzeWeatherImpact(mockData));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [matchId, city, country, showImpactAnalysis]);

  if (loading) {
    return (
      <Card className="p-4 bg-card/50 animate-pulse">
        <div className="h-20 bg-muted rounded" />
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-success/20 text-success border-success/50';
      case 'medium': return 'bg-warning/20 text-warning border-warning/50';
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-card/30 rounded-lg border border-border">
        <span className="text-3xl">{weatherService.getWeatherIcon(weather.weather_condition)}</span>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{Math.round(weather.temperature_celsius)}°C</span>
            <span className="text-sm text-muted-foreground">{weather.weather_condition}</span>
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              {weather.humidity_percent}%
            </span>
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3" />
              {Math.round(weather.wind_speed_kmh)} km/h
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4 sm:p-6 bg-card/50 border-border backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Weather Conditions</h3>
            {city && <p className="text-sm text-muted-foreground">{city}, {country}</p>}
          </div>
          <span className="text-4xl">{weatherService.getWeatherIcon(weather.weather_condition)}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-start gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Thermometer className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="text-lg font-bold text-foreground">{Math.round(weather.temperature_celsius)}°C</p>
              <p className="text-xs text-muted-foreground">Feels like {Math.round(weather.feels_like_celsius)}°C</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Droplets className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-lg font-bold text-foreground">{weather.humidity_percent}%</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wind className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-lg font-bold text-foreground">{Math.round(weather.wind_speed_kmh)} km/h</p>
              <p className="text-xs text-muted-foreground">{weather.wind_direction}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Cloud className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Condition</p>
              <p className="text-sm font-semibold text-foreground">{weather.weather_condition}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-lg font-bold text-foreground">{weather.visibility_km} km</p>
            </div>
          </div>

          {weather.precipitation_mm > 0 && (
            <div className="flex items-start gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Droplets className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Precipitation</p>
                <p className="text-lg font-bold text-foreground">{weather.precipitation_mm} mm</p>
              </div>
            </div>
          )}
        </div>

        {showImpactAnalysis && impact && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Performance Impact</h4>
              <Badge className={getRiskColor(impact.risk_level)}>
                {impact.risk_level.toUpperCase()} RISK
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Expected Performance:</span>
              <span className={`text-sm font-bold ${
                impact.performance_modifier >= 0.95 ? 'text-success' :
                impact.performance_modifier >= 0.85 ? 'text-warning' : 'text-destructive'
              }`}>
                {(impact.performance_modifier * 100).toFixed(1)}%
              </span>
            </div>

            {impact.recommendations.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">Recommendations:</p>
                <ul className="space-y-1">
                  {impact.recommendations.map((rec, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
