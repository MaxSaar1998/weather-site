import { useState } from 'react'
import PropTypes from 'prop-types';

import WeatherIcon from '../components/weatherIcon';

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import moment from 'moment-timezone';
import formatWindDirection from '../utils/formatWindDirection';




const DayCard = ({index, day, timezone}) => {

    let momentDate = moment(day.datetimeEpoch*1000);

    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => {setIsOpen(!isOpen)}}
                className={`px-1 py-1 rounded-md w-full min-w-24 flex flex-row items-center
                `} key={index}>
                {/* Hack to get date in local time instead of utc */}
                <div className='flex flex-row items-center w-24'>
                    <div className='text-lg mr-2 w-9 text-left text-nowrap'>{momentDate.format('ddd')}</div>
                    <div className='text-xs text-gray-500 mt-0.5 text-nowrap'>{momentDate.format('MMM D')}</div>
                </div>
                <div className='flex flex-row items-center flex-nowrap w-26 mt-0.5 ml-4'>
                    <div className='text-md text-nowrap mr-0.25 w-12'>H: {Math.round(day.tempmax)}°</div>
                    <div className='text-sm text-nowrap w-12 text-gray-400 ml-1 mt-0.5'>L: {Math.round(day.tempmin)}°</div>
                </div>
                <WeatherIcon className='ml-4 mr-2' iconName={day.icon} />
                <div className='hidden sm:block mr-auto text-sm text-gray-400'>{day.conditions}</div>
                
                {!isOpen &&
                    <IoIosArrowDown className='ml-auto' />
                }
                {isOpen && 
                    <IoIosArrowUp className='ml-auto'/>
                }
            </button>
            {isOpen && 
                <div className='block sm:flex sm:flex-row sm:justify-between pb-4'>
                    <div className='text-gray-500'>
                        <p className='text-black max-w-100'>{day.description}</p>
                        <p className='block sm:hidden'>{day.conditions}</p>
                        <p>Humidity: {Math.round(day.humidity)}%</p>
                        {day.preciptype &&
                            <p>Chance of {day.preciptype[0]}: {Math.round(day.precipprob)}%</p>
                        }
                        <p>Wind: {Math.round(day.windspeed)}km/h {formatWindDirection(day.winddir)}</p>
                        <p>UV Index: {day.uvindex}/11</p>
                        <p>Cloud cover: {day.cloudcover}%</p>
                    </div>
                    <div className='text-gray-500 text-left sm:text-right'>
                        <p>Sunrise: {moment.tz(day.sunriseEpoch * 1000, timezone).format('h:mm A z')}</p>
                        <p>Sunset: {moment.tz(day.sunsetEpoch * 1000, timezone).format('h:mm A z')}</p>

                    </div>
                </div>
            }
        </div>
    )
}

DayCard.propTypes = {
    index: PropTypes.number.isRequired,
    day: PropTypes.shape({
        datetimeEpoch: PropTypes.number.isRequired,
        icon: PropTypes.string.isRequired,
        tempmax: PropTypes.number.isRequired,
        tempmin: PropTypes.number.isRequired,
        conditions: PropTypes.string.isRequired,
        windspeed: PropTypes.number.isRequired,
        winddir: PropTypes.number.isRequired,
        preciptype: PropTypes.arrayOf(PropTypes.string) || null,
        precipprob: PropTypes.number.isRequired,
        uvindex: PropTypes.number.isRequired,
        humidity: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        sunriseEpoch: PropTypes.number.isRequired,
        sunsetEpoch: PropTypes.number.isRequired,
        cloudcover: PropTypes.number.isRequired,
    }).isRequired,
    timezone: PropTypes.string.isRequired,
};

export default DayCard;
