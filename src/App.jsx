import { useState, useEffect } from 'react'
import './App.css'
import apiKeys from '../apiKeys.json';

import { formatDate } from './utils/formatDate';
import useIsMobile from './utils/useIsMobile';

import HorizontalLine from './components/horizontalLine';
import CustomToolTip from './components/customToolTip';
import WeatherIcon from './components/weatherIcon';
import Loading from './components/loading';
import DayCard from './components/dayCard';

import { AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import Navbar from './components/navbar';

import LocationSelect from './pages/locationSelect';
import formatWindDirection from './utils/formatWindDirection';

import moment from 'moment-timezone';


function App() {

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    // For keeping track of the time that the current weather data was fetched
    const [forecastWeatherData, setForecastWeatherData] = useState(null);
    const [address, setAddress] = useState(null);

    const [fetchingForecast, setFetchingForecast] = useState(false);

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);



    const [timeOfForecastFetch, setTimeofForecastFetch] = useState(null);

    const isMobile = useIsMobile();

    // nearestHour is used to get the current weather data out of the forecasted data
    let nearestHour;

    
    const hourlyWeatherMap = [];
    // Populate the hourlyWeatherMap with the forecast weather data
    if (forecastWeatherData && forecastWeatherData.days) {
      // only use the weather for the selected day
      let day = forecastWeatherData.days[0];
      day.hours.forEach(hour => {
        hourlyWeatherMap.push({
          moment: moment.tz(hour.datetimeEpoch * 1000, forecastWeatherData.timezone),
          time: formatDate(new Date(hour.datetimeEpoch * 1000)),
          temp: hour.temp,
          icon: hour.icon,
          weather: hour.conditions,
          humidity: hour.humidity,
          wind: hour.windspeed,
        });
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

    const reverseGeocode = (latitude, longitude) => {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Got data from nominatum", data);
          setAddress(data.address);
        })
        .catch((error) => {
          console.log("Error fetching from nominatim", error);
        })
    }

    const fetchForecast = (latitude, longitude) => {
      // 15 day forecast comes from visualcrossing
      setFetchingForecast(true);
      fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=${apiKeys.visualCrossing}&cache=false`
      )
      .then((res) => res.json())
      .then((data) => {

        console.log('success fetching forecast data', data);

        setForecastWeatherData(data);
        setTimeofForecastFetch(new Date());
        setFetchingForecast(false);
      })
    }

    useEffect(() => {
      // Set up screen width tracking
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };
  
      window.addEventListener('resize', handleResize);


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
            reverseGeocode(position.coords.latitude, position.coords.longitude);

            fetchForecast(position.coords.latitude, position.coords.longitude);

          },
          (err) => {
            setError(`Error: ${err.message}`);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    }, []);

    const currentWeather = forecastWeatherData?.days[0]?.hours[nearestHour];


  return (
    <div className='bg-gradient-to-br
      from-[var(--background-light-color)] to-[var(--background-dark-color)]
      min-h-screen
      flex flex-col'>
      <Navbar />
      <div className='max-w-2xl mx-auto flex-1 flex flex-col items-center w-full'>   

        {!location &&
          // Show the location search bar menu
          <LocationSelect handleSearch={term => {
            // Fetch the latitude and longitude from geocode
            const formattedTerm = term.replace(/ /g, "+");
            fetch(
              `https://geocode.maps.co/search?q=${formattedTerm}&api_key=${apiKeys.geocode}`
            )
            .then((res) => res.json())
            .then((data) => {
              if(data[0] && data[0].lat && data[0].lon) {
                setLocation({latitude: data[0].lat, longitude: data[0].lon});
                // Now reverse geocode with the latitude
                reverseGeocode(data[0].lat, data[0].lon);
                // Fetch a new hourly forecast
                fetchForecast(data[0].lat, data[0].lon);
              }
            })
            .catch(error => {
              console.log('Error searching with geocode', error);
            })
          }}/>
        }

        {location && fetchingForecast &&
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Loading/>
          </div>
        } 

        {location && !fetchingForecast && address &&
          <div className='flex flex-col w-full px-4'>

            {/* Current Weather Section */}
            <div className='px-4 py-2 rounded-md mt-4 md:mt-8 w-full max-w-full mx-auto shadow-lg bg-[var(--background-box-color)]'>
              <div className='flex flex-row items-center justify-between mx-auto'>
                <h1 className='text-2xl font-bold'>Current Weather</h1>
                <button
                  className='text-blue-500 text-right'
                  onClick={() => {setLocation(null)}}>Change Location {`>`}</button>
              </div>
              <p>{address.town ? `${address.town}, `: (address.city ? `${address.city}, `: '')}{address.state}, {address.country}</p>

              <div className='flex flex-row justify-between'>
                <div className='text-gray-500'>
                  <p>{moment.tz(timeOfForecastFetch, forecastWeatherData.timezone).format('h:mm A z')}</p>
                  <p>{currentWeather.conditions}</p>
                  <p>Humidity: {Math.round(currentWeather.humidity)}%</p>
                  {currentWeather.preciptype &&
                    <p>Chance of {currentWeather.preciptype[0]}: {Math.round(currentWeather.precipprob)}%</p>
                  }
                  <p>Wind: {Math.round(currentWeather.windspeed)}km/h {formatWindDirection(currentWeather.winddir)}</p>
                </div>
                <div className='flex flex-col items-center content-end'>
                  <WeatherIcon iconName={currentWeather.icon} size={24} className='-mt-2' />
                  <div className='text-2xl md:text-3xl font-bold -mt-1'>{Math.round(currentWeather.temp)}°C</div>
                </div>
              </div>
            </div>

            {/* Forecast Section */}
            {forecastWeatherData &&
              <div className='px-4 py-2 rounded-md mt-4 md:mt-8 w-full max-w-full mx-auto shadow-lg bg-[var(--background-box-color)]'>
                <h1 className='text-2xl md:text-2xl font-bold'>
                  Hourly Temperature
                </h1>
                  
                {hourlyWeatherMap &&
                  <div className='w-full max-w-4xl py-4'>
                  <AreaChart width={isMobile ? Math.min((screenWidth - 100), 600) : 600} height={isMobile ? 300 : 300} data={hourlyWeatherMap}>
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
            }
              {/* 15 Day list */}

              {forecastWeatherData && forecastWeatherData.days &&

                <div className='px-4 py-2 rounded-md mt-4 md:mt-8 w-full mb-4 md:mb-8 max-w-full mx-auto shadow-lg bg-[var(--background-box-color)]'>
                  <h1 className='text-2xl md:text-2xl font-bold mb-2'>
                    15 Day Forecast
                  </h1>
                  <div className='flex flex-col'>
                    {forecastWeatherData.days.slice(0, 15).map((element, index) => {
                      // Render a weather card for each day
                      return (
                        <>
                          <HorizontalLine/>
                          <DayCard index={index} day={element} timezone={forecastWeatherData.timezone}/>
                        </>
                      );
                    })}
                  </div>
                </div>
              }

              {/* Credits Section */}
              {/* TODO: add credits to OpenStreetMap, nominatum, geocode*/}
              <div className='flex flex-col items-center mb-8 md:mb-12 mt-4 md:mt-8 '>
                <p>This website uses the following APIs:</p>
                <a target='_blank' href='https://geocode.maps.co/'>geocode.maps.co</a>
                <a target='_blank' href='https://www.visualcrossing.com/weather-api/'>Visual Crossing</a>
                <a target='_blank' href='https://nominatim.org/'>Nominatim</a>
              </div>              
          </div>
        }
      </div>
    </div>
  )
}

export default App;
