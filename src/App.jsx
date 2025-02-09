import { useState, useEffect } from 'react'
import './App.css'
import apiKeys from '../apiKeys.json';

import { dateToUtc } from './utils/dateToUtc';
import { formatDate } from './utils/formatDate';
import { dateToTime } from './utils/dateToTime';
import { dateToWeekday } from './utils/dateToWeekday';
import { weatherName } from './utils/weatherName';
import { metersPerSecondToKmPerHour} from './utils/metersPerSecondToKmPerHour';
import useIsMobile from './utils/useIsMobile';

import HorizontalLine from './components/horizontalLine';
import CustomToolTip from './components/customToolTip';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';


function App() {

    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);
    const [currentWeatherData, setCurrentWeatherData] = useState(null);
    // For keeping track of the time that the current weather data was fetched
    const [currentWeatherTime, setCurrentWeatherTime] = useState(null);
    const [forecastWeatherData, setForecastWeatherData] = useState(null);

    const isMobile = useIsMobile();


    // Convert the forecast weather data into
  
    const forecastWeatherMap = forecastWeatherData ?
      forecastWeatherData.list.map((forecast) => {
        return {
          time: formatDate(dateToUtc(forecast.dt_txt)),
          temp: forecast.main.temp,
          humidity: forecast.main.humidity,
          wind: forecast.wind.speed,
          weather: weatherName(forecast.weather[0].id),
          icon: forecast.weather[0].icon,
        };
      })
    : null;

    console.log("forecastWeatherMap", forecastWeatherMap);

    useEffect(() => {
      // Check if geolocation is available in the browser
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            // Now that we have the location, let's fetch the weather data
            
            // Currentweather data comes from api.openweathermap.org
            if(!currentWeatherData) {
              console.log("fetching weather data...");
              fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKeys.openWeather}&units=metric`
              )
                .then((res) => res.json())
                .then((data) => {
                  setCurrentWeatherData(data);
                  setCurrentWeatherTime(new Date());
                  console.log("Success fetching weather data:", data);
                })
                .catch((err) => {
                  setError(`Error fetching weather: ${err.message}`);
                }
              )
            }

            // Forecast weather data comes from open-meteo api
            if(!forecastWeatherData){
              console.log("fetching forecast data...");
              fetch(
                `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKeys.openWeather}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`

                //`https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&daily=temperature_2m_max&daily=temperature_2m_min&forecast_days=8`
              )
                .then((res) => res.json())
                .then((data) => {
                  setForecastWeatherData(data);
                  console.log("Success fetching forecast data:", data);
                  
                  console.log("data.hourly", data.hourly)
                })
                .catch((err) => {
                  setError(`Error fetching forecast: ${err.message}`);
                }
              )
            }

          },
          (err) => {
            setError(`Error: ${err.message}`);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    }, []);


  return (
    <>
      <div className='max-w-5xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center'>
          {currentWeatherData && currentWeatherData.name &&
            <div className='flex flex-col items-center pt-4 md:pt-8 pb-2 md:pb-4'>
              <div>Your Location:</div>
              <h1 className='text-3xl'>{currentWeatherData.name}</h1>
              {location.latitude && location.longitude ? (
                <p className='text-sm text-gray-700 mt-1'>
                  Lat: {location.latitude.toFixed(1)}, Long: {location.longitude.toFixed(1)}
                </p>
              ) : (
                <p>Loading location...</p>
              )}
                </div>
          }

          <HorizontalLine />
          {/* NOW */}

          <div className='flex flex-col items-center p-2'>
            <h1 className='text-2xl md:text-3xl font-bold'>Now</h1>
            <div>
              {
              currentWeatherTime &&
                `${dateToWeekday(currentWeatherTime)} ${dateToTime(currentWeatherTime)}`
              }
            </div>
            {currentWeatherData && currentWeatherData.weather && currentWeatherData.weather[0] &&
              <div className='flex flex-col items-center'>
                <div className='text-md md:text-xl'>{weatherName(currentWeatherData.weather[0].id)}</div>
                <img
                  className='w-24 h-24 md:w-32 md:h-32 -mt-2 -mb-4 md:-mt-6 md:-mb-8'
                  src={`https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`}
                />
                {currentWeatherData && currentWeatherData.main &&
                  <>
                    <div className='text-xl'>{currentWeatherData.main.temp.toFixed(1)}°C</div>
                    <div>Humidity: {currentWeatherData.main.humidity}%</div>
                    <div>Wind: {metersPerSecondToKmPerHour(currentWeatherData.wind.speed).toFixed(0)}km/h</div>
                  </>
                }



              </div>
            }
          </div>
          <HorizontalLine />

          {/* Forecast */}
          <div className='flex flex-col items-center p-2 w-full'>
            <h1 className='text-2xl md:text-3xl font-bold'>Forecast</h1>
            {forecastWeatherMap &&
              <div className='custom-scrollbar-x w-full max-w-4xl overflow-x-scroll py-4'>
                <LineChart width={isMobile ? 2100 : 4100} height={isMobile ? 300 : 400} data={forecastWeatherMap}>
                  <Line type="monotone" dataKey="temp" stroke="#000000" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: isMobile ? 9 : 12 }}
                  />
                  <YAxis />
                  <Tooltip content={<CustomToolTip />} />
                </LineChart>
              </div>
            }
            {/* TODO: add 5 days selector  */}
          </div>
          


          <HorizontalLine />
          {error && <div className='text-red-500'>{error}</div>}

        </div>
    </>
  )
}

export default App
