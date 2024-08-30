import React from "react";
import UseFetch from "../hooks/useFetch";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import {
  sunnyOutline,
  moonOutline,
  cloudOutline,
  rainyOutline,
  partlySunnyOutline,
} from "ionicons/icons";
import "./ForcastWeather.css";

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

const weatherIconMapping: { [key: string]: string } = {
  "01d": sunnyOutline, // Clear sky day
  "01n": moonOutline, // Clear sky night

  "02d": partlySunnyOutline, // Few clouds day
  "02n": cloudOutline, // Few clouds night

  "03d": partlySunnyOutline, // Scattered clouds day
  "03n": cloudOutline, // Scattered clouds night

  "04d": cloudOutline, // Overcast day
  "04n": cloudOutline, // Overcast night

  "05d": rainyOutline, // Rain day
  "05n": rainyOutline, // Rain night
};

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
    <IonCard className="IonCaard">
      <IonCardHeader>
        <IonCardTitle className="ionCardTitle">
          5-Day Weather Forecast
        </IonCardTitle>
        <IonCardSubtitle className="iconCardSub">
          {data.city.name}
        </IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <IonList>
          {dailyForecasts.map((day: any, index) => {
            const iconCode = day.weather[0].icon.replace("n", "d"); // byt om på dag og nat iconer(hvorfor er default nat??)

            return (
              <IonItem key={index} className="ionItem">
                <IonIcon
                  icon={weatherIconMapping[iconCode] || cloudOutline}
                  slot="start"
                  style={{
                    fontSize: "2.5em",
                    color: "#333",
                    paddingLeft: "20px",
                  }}
                />
                <IonLabel>
                  <h2
                    style={{
                      color: "#333",
                      fontSize: "1.2em",
                      paddingBottom: "3px",
                    }}
                  >
                    {day.date}
                  </h2>
                  <p
                    style={{
                      color: "#444",
                      fontSize: "1.3em",
                      fontWeight: "600",
                    }}
                  >
                    {Math.round(day.temp.max)}&deg;C (min:{" "}
                    {Math.round(day.temp.min)}&deg;C)
                  </p>
                  <p>Weather: {day.weather[0].description}</p>
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default WeatherForecast;
