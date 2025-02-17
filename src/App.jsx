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
import formatTemp from './utils/formatTemp';
import formatWindSpeed from './utils/formatWindSpeed';


function App() {

    const [location, setLocation] = useState(null);
    //const [error, setError] = useState(null);
    // For keeping track of the time that the current weather data was fetched
    const [forecastWeatherData, setForecastWeatherData] = useState(null);
    const [address, setAddress] = useState(null);

    const [fetchingForecast, setFetchingForecast] = useState(false);

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const [isMetric, setIsMetric] = useState(true);



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
          time: moment.tz(hour.datetimeEpoch * 1000, forecastWeatherData.timezone).format('h:mm A'),
          temp: hour.temp,
          icon: hour.icon,
          weather: hour.conditions,
          humidity: hour.humidity,
          wind: hour.windspeed,
          winddir: hour.winddir,
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
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=${apiKeys.visualCrossing}`
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
            console.log('Error: ', err.message);
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser')
      }
    }, []);

    const currentWeather = forecastWeatherData?.days[0]?.hours[nearestHour];

  return (
    <div className='bg-gradient-to-br
      from-[var(--background-light-color)] to-[var(--background-dark-color)]
      min-h-screen
      flex flex-col pt-12'>
      <Navbar isMetric={isMetric} setIsMetric={(metric) => {setIsMetric(metric)}}/>
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
                <h1 className='text-xl xs:text-2xl font-bold'>Current Weather</h1>
                <button
                  className='text-sm xs:text-base text-blue-500 text-right ml-0.5'
                  onClick={() => {setLocation(null)}}>Change Location {`>`}</button>
              </div>
              <p className='text-sm xs:text-base'>
                {address.town ? `${address.town}, `: (address.city ? `${address.city}, `: '')}{address.state}, {address.country}</p>

              <div className='flex flex-row justify-between'>
                <div className='text-gray-500'>
                  <p className='text-sm xs:text-base'>{moment.tz(timeOfForecastFetch, forecastWeatherData.timezone).format('h:mm A z')}</p>
                  <p className='text-sm xs:text-base'>{currentWeather.conditions}</p>
                  <p className='text-sm xs:text-base'>Humidity: {Math.round(currentWeather.humidity)}%</p>
                  {currentWeather.preciptype &&
                    <p className='text-sm xs:text-base'>Chance of {currentWeather.preciptype[0]}: {Math.round(currentWeather.precipprob)}%</p>
                  }
                  <p className='text-sm xs:text-base'>Wind: {formatWindSpeed(currentWeather.windspeed, isMetric)} {formatWindDirection(currentWeather.winddir)}</p>
                </div>
                <div className='flex flex-col items-center content-end'>
                  <WeatherIcon iconName={currentWeather.icon} className='-mt-2 w-16 h-16 xs:w-24 xs:h-24' />
                  <div className='text-xl xs:text-2xl md:text-3xl font-bold -mt-1'>{formatTemp(currentWeather.temp, isMetric)}</div>
                </div>
              </div>
            </div>

            {/* Hourly Temperature Section */}
            {forecastWeatherData &&
              <div className='px-4 py-2 rounded-md mt-4 md:mt-8 w-full max-w-full mx-auto shadow-lg bg-[var(--background-box-color)]'>
                <h1 className='text-xl xs:text-2xl md:text-2xl font-bold'>
                  Hourly Temperature
                </h1>
                {hourlyWeatherMap &&
                  <div className='w-full max-w-4xl py-4'>
                  <AreaChart
                    width={isMobile ? Math.min((screenWidth - 100), 600) : 600}
                    height={isMobile ? Math.min((screenWidth * 9/16), 300) : 300}
                    data={hourlyWeatherMap}

                  >
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: isMobile ? 9 : 12 }}
                    />
                    <YAxis />
                    <Tooltip content={<CustomToolTip isMetric={isMetric} />} />
                    <Area type="monotone" dataKey="temp" stroke="#8884d8" strokeWidth={4} fill="#ffffff" />

                  </AreaChart>
                </div>
                }
              </div>
            }
              {/* 15 Day list */}

              {forecastWeatherData && forecastWeatherData.days &&

                <div className='px-4 py-2 rounded-md mt-4 md:mt-8 w-full mb-4 md:mb-8 max-w-full mx-auto shadow-lg bg-[var(--background-box-color)]'>
                  <h1 className='text-xl xs:text-2xl md:text-2xl font-bold mb-2'>
                    15 Day Forecast
                  </h1>
                  <div className='flex flex-col'>
                    {forecastWeatherData.days.slice(0, 15).map((element, index) => {
                      // Render a weather card for each day
                      return (
                        <>
                          <HorizontalLine/>
                          <DayCard index={index} day={element} timezone={forecastWeatherData.timezone} isMetric={isMetric}/>
                        </>
                      );
                    })}
                  </div>
                </div>
              }

              {/* Credits Section */}
              {/* TODO: add credits to OpenStreetMap, nominatum, geocode*/}
              <div className='flex flex-col items-center mb-8 md:mb-12 mt-4 md:mt-8 '>
                <p>Weather and location data from:</p>
                <a target='_blank'
                  href='https://geocode.maps.co/'
                  rel="noopener noreferrer"
                  >geocode.maps.co
                </a>
                <a target='_blank'
                  href='https://www.visualcrossing.com/weather-api/'
                  rel="noopener noreferrer"
                >Visual Crossing</a>
                <a target='_blank'
                  href='https://www.openstreetmap.org/'
                  rel="noopener noreferrer"
                >OpenStreetMap</a>
              </div>              
          </div>
        }
      </div>
    </div>
  )
}

export default App;
