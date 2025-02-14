import { useState, useEffect } from 'react'
import './App.css'
import apiKeys from '../apiKeys.json';

import { formatDate } from './utils/formatDate';
import { dateToWeekday } from './utils/dateToWeekday';
import useIsMobile from './utils/useIsMobile';

import HorizontalLine from './components/horizontalLine';
import CustomToolTip from './components/customToolTip';
import WeatherIcon from './components/weatherIcon';

import { AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';


function App() {

    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);
    // For keeping track of the time that the current weather data was fetched
    const [forecastWeatherData, setForecastWeatherData] = useState(null);
    const [address, setAddress] = useState(null);

    const [selectedDay, setSelectedDay] = useState(0);



    const [timeOfForecastFetch, setTimeofForecastFetch] = useState(null);

    const isMobile = useIsMobile();

    // nearestHour is used to get the current weather data out of the forecasted data
    let nearestHour;

    
    const hourlyWeatherMap = [];
    // Populate the hourlyWeatherMap with the forecast weather data
    if (forecastWeatherData && forecastWeatherData.days) {
      forecastWeatherData.days.forEach(day => {
        day.hours.forEach(hour => {
          hourlyWeatherMap.push({
            time: formatDate(new Date(hour.datetimeEpoch * 1000)),
            temp: hour.temp,
            icon: hour.icon,
            weather: hour.conditions,
          });
        })
      })

      if(timeOfForecastFetch) {
        // Get the current weather by rounding the current time to the nearest hour and then finding it in the forecast
        const hours = timeOfForecastFetch.getHours();
        const minutes = timeOfForecastFetch.getMinutes();

        nearestHour = hours;
        if(minutes >= 30) {
          // Round up
          nearestHour += 1;
        }
      }

    };


    console.log('hourlyWeatherMap', hourlyWeatherMap);

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

            // Use nominatim to get the closest city
            fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            )
              .then((res) => res.json())
              .then((data) => {
                console.log("Got data from nominatum", data);
                setAddress(data.address);
              })
              .catch((error) => {
                console.log("Error fetching from nominatim", error);
              })

            // 15 day forecast comes from visualcrossing
            if(!forecastWeatherData) {
              fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${position.coords.latitude},${position.coords.longitude}?unitGroup=metric&key=${apiKeys.visualCrossing}&cache=false`
              )
              .then((res) => res.json())
              .then((data) => {

                console.log('success fetching forecast data', data);

                setForecastWeatherData(data);
                setTimeofForecastFetch(new Date());
              })
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
      <div className='max-w-5xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center py-4 md:py-6 lg:py-8'>
        
        
        <div className='flex w-full flex-row justify-between  '>
          <div className='flex flex-col items-start p-2'>
              <div className='flex flex-row'>
                <div>
                  {forecastWeatherData &&
                    <div className='flex flex-row'>
                      <div className='text-2xl md:text-3xl font-bold'>{Math.round(forecastWeatherData.days[0].hours[nearestHour].temp)}</div>
                      <div className='text-lg ml-2' >°C</div>
                    </div>
                  }
                  <div>
                      </div>
                    <div className='flex flex-row items-start'>
                    {address && address.town &&

                      <div>
                        <div className='text-sm'>{address.town}, {address.state}</div>
                      </div>
                    }
                    </div>
              </div>
              </div>

            </div>

              <div className='flex flex-col items-end'>
                <div>Your Location:</div>
                { address && address.town &&
                  <h1 className='text-xl'>{address.town}, {address.state}</h1>
                }
                {location.latitude && location.longitude ? (
                  <p className='text-sm text-gray-700 mt-1'>
                    Lat: {location.latitude.toFixed(1)}, Long: {location.longitude.toFixed(1)}
                  </p>
                ) : (
                  <p>Loading location...</p>
                )}
                  </div>
          </div>

          <HorizontalLine />

            {/* 15 Day list */}

            {forecastWeatherData && forecastWeatherData.days &&
              <div className='flex flex-row w-full custom-scrollbar-x overflow-x-auto pt-4 pb-8'>
                {forecastWeatherData.days.slice(0, 15).map((element, index) => {
                  console.log('index', index);
                  // Render a weather card for each day
                  return (
                    <button
                      onClick={() => {setSelectedDay(index)}}
                      className={`px-1 py-1 rounded-md w-24 min-w-24 flex flex-col items-center mx-1
                        ${(selectedDay == index) ? ' bg-gray-100' : ' bg-white'}
                        ${console.log('selectedDay', selectedDay)}
                      `} key={index}>
                      {/* Hack to get date in local time instead of utc */}
                      <div className='text-lg'>{dateToWeekday(new Date(element.datetime.replace(/-/g, "/")), true)}</div>
                      <div className='text-xs text-gray-500 -mt-1'>{} Feb 5 </div>
                      <WeatherIcon iconName={element.icon} />
                      <div className='flex flex-row overflow-visible flex-nowrap justify-between'>
                        <div className='text-sm text-nowrap'>H: {Math.round(element.tempmax)}°</div>
                        <div className='text-sm text-nowrap text-gray-400 ml-1'>L: {Math.round(element.tempmin)}°</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            }

          <HorizontalLine />

          {/* Forecast */}
          <div className='flex flex-col items-center w-full custom-scrollbar-x overflow-x-scroll'>
            <h1 className='text-2xl md:text-3xl font-bold'>Forecast</h1>
            {hourlyWeatherMap &&
              <div className='w-full max-w-4xl py-4'>
              <AreaChart width={isMobile ? 5600 : 8000} height={isMobile ? 300 : 300} data={hourlyWeatherMap}>
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: isMobile ? 9 : 12 }}
                />
                <YAxis />
                <Tooltip content={<CustomToolTip />} />
                <Area type="monotone" dataKey="temp" stroke="#8884d8" fillOpacity={1} fill="url(#colorTemp)" />

              </AreaChart>
            </div>
            }
          </div>

          {error && <div className='text-red-500'>{error}</div>}

        </div>
    </>
  )
}

export default App
