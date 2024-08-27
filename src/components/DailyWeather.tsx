import React from "react";
import UseFetch from "../hooks/useFetch";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { arrowForwardOutline } from "ionicons/icons";
import './WeatherForecast.css';

interface Temp {
  day: number;
  min: number;
  max: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface DailyForecast {
  dt: number;
  temp: Temp;
  weather: Weather[];
  wind_speed: number;
  wind_deg: number;
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp_min: number;
      temp_max: number;
    };
    weather: Weather[];
    wind: {
      speed: number;
      deg: number;
    };
  }[];
  city: {
    timezone: string;
    name: string;
  };
}

const WeatherForecast: React.FC = () => {
  const [data] = UseFetch<ForecastData>(
    "https://api.openweathermap.org/data/2.5/forecast?zip=8500,dk&units=metric&appid=76799082ae1442b626cf882793217343"
  );

  if (!data || !data.list) {
    return <p>Loading...</p>;
  }

  // Grouping data by day
  const dailyData = data.list.reduce((acc: any, current) => {
    const date = new Date(current.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        date,
        temp: {
          min: current.main.temp_min,
          max: current.main.temp_max,
        },
        weather: current.weather,
        wind_speed: current.wind.speed,
        wind_deg: current.wind.deg,
      };
    } else {
      acc[date].temp.min = Math.min(acc[date].temp.min, current.main.temp_min);
      acc[date].temp.max = Math.max(acc[date].temp.max, current.main.temp_max);
    }
    return acc;
  }, {});

  const dailyForecasts = Object.values(dailyData);

  return (
    <IonCard className="daily-weather-card">
      <IonCardHeader>
        <IonCardTitle className="daily-weather-title">5-Day Weather Forecast</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <h2>Weather in {data.city.name}</h2>
        <IonList className="daily-weather-list">
          {dailyForecasts.map((day: any, index) => (
            <IonItem key={index} className="daily-weather-item">
              <IonLabel className="daily-weather-date">{day.date}</IonLabel>
              <div className="daily-weather-temp">
                {Math.round(day.temp.max)}&deg;C (min: {Math.round(day.temp.min)}&deg;C)
              </div>
              <div className="daily-weather-details">
                <div>
                  Wind: {day.wind_speed} m/s
                </div>
                <div>
                  Wind Direction: {day.wind_deg}°
                  <IonIcon
                    icon={arrowForwardOutline}
                    className="daily-weather-icon"
                    style={{
                      transform: `rotate(${day.wind_deg}deg)`,
                    }}
                  />
                </div>
                <div>
                  Weather: {day.weather[0].description}
                </div>
              </div>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default WeatherForecast;
