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
  IonCardSubtitle
} from "@ionic/react";
import { sunnyOutline, moonOutline, cloudOutline, rainyOutline, partlySunnyOutline } from "ionicons/icons";
import './CurrentWeather.css'; // Import the CSS file

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface Wind {
  speed: number;
  deg: number;
}

interface Sys {
  country: string;
  sunrise: number;
  sunset: number;
}

interface CurrentWeather {
  name: string;
  weather: Weather[];
  main: Main;
  wind: Wind;
  sys: Sys;
}

// Mapping weather icons to IonIcon
const weatherIconMapping: { [key: string]: any } = {
  "01d": sunnyOutline, // Clear sky day
  "01n": moonOutline, // Clear sky night
  "02d": partlySunnyOutline, // Few clouds day
  "02n": cloudOutline, // Few clouds night
  "03d": rainyOutline, // Rainy day
  "03n": rainyOutline, // Rainy night
  "04d": cloudOutline, // Overcast day
  "04n": cloudOutline, // Overcast night
};

const CurrentWeather: React.FC = () => {
  const [data] = UseFetch<CurrentWeather>(
    "https://api.openweathermap.org/data/2.5/weather?zip=8500,dk&units=metric&appid=76799082ae1442b626cf882793217343"
  );

  // Early return if data is not yet available
  if (!data || !data.main || !data.wind || !data.sys || !data.weather) {
    return <p>Loading...</p>;
  }

  // Get the weather icon code and map it to IonIcon
  const iconCode = data.weather[0].icon;
  const weatherIcon = weatherIconMapping[iconCode] || cloudOutline; // Default to cloudOutline if icon not found

  return (
    <IonCard className="current-weather-card">
      <IonCardHeader>
        <IonCardTitle className="current-weather-title">Current Weather</IonCardTitle>
        <IonCardSubtitle className="current-weather-city-name">Vejret for {data.name}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <IonList className="current-weather-list">
          <IonItem className="current-weather-item">
            <IonIcon icon={weatherIcon} className="current-weather-icon" slot="start" />
            <IonLabel>
              <div className="currentDeg">{Math.round(data.main.temp)}&deg;C</div>
              <div>Feels like: {Math.round(data.main.feels_like)}&deg;C</div>
              <div>Min: {Math.round(data.main.temp_min)}&deg;C, Max: {Math.round(data.main.temp_max)}&deg;C</div>
            </IonLabel>
          </IonItem>
          <IonItem className="current-weather-item">
            <IonLabel>Vindhastighed:</IonLabel>
            <div>{data.wind.speed} m/sek</div>
          </IonItem>
          <IonItem className="current-weather-item">
            <IonLabel>Vindretning:</IonLabel>
            <div style={{ display: "flex", alignItems: "center" }}>
              {data.wind.deg}°
              <IonIcon
                icon="arrowForwardOutline"
                className="current-weather-icon"
                style={{
                  transform: `rotate(${data.wind.deg}deg)`,
                }}
              />
            </div>
          </IonItem>
          <IonItem className="current-weather-item">
            <IonLabel>Solen står op:</IonLabel>
            <div>
              {new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </IonItem>
          <IonItem className="current-weather-item">
            <IonLabel>Solen går ned:</IonLabel>
            <div>
              {new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default CurrentWeather;
