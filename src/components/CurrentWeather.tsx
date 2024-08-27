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

const CurrentWeather: React.FC = () => {
  const [data] = UseFetch<CurrentWeather>(
    "https://api.openweathermap.org/data/2.5/weather?zip=8500,dk&units=metric&appid=76799082ae1442b626cf882793217343"
  );

  console.log(data);

  return (
    <IonCard className="current-weather-card">
      <IonCardHeader>
        <IonCardTitle className="current-weather-title">Current Weather</IonCardTitle>
      </IonCardHeader>

      {data && (
        <IonCardContent>
          <h2>Vejret for {data.name}</h2>
          <IonList className="current-weather-list">
            <IonItem className="current-weather-item">
              <IonLabel>Temperatur:</IonLabel>
              <div>{Math.round(data.main.temp)}&deg;C</div>
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
                  icon={arrowForwardOutline}
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
      )}
    </IonCard>
  );
};

export default CurrentWeather;
