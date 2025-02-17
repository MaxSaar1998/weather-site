import { useState } from 'react'
import PropTypes from 'prop-types';

import WeatherIcon from '../components/weatherIcon';

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import moment from 'moment-timezone';
import formatWindDirection from '../utils/formatWindDirection';
import formatTemp from '../utils/formatTemp';
import formatWindSpeed from '../utils/formatWindSpeed';




const DayCard = ({index, day, timezone, isMetric}) => {

    let momentDate = moment(day.datetimeEpoch*1000);

    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => {setIsOpen(!isOpen)}}
                className={`py-1 rounded-md w-full min-w-24 flex flex-row items-center
                `} key={index}>
                {/* Hack to get date in local time instead of utc */}
                <div className='flex flex-row items-center w-24'>
                    <div className='text-base xs:text-lg mr-2 w-8 xs:w-9 text-left text-nowrap'>{momentDate.format('ddd')}</div>
                    <div className='text-xs text-gray-500 mt-0.5 text-nowrap'>{momentDate.format('MMM D')}</div>
                </div>
                <div className='flex flex-row items-center flex-nowrap w-26 mt-0.5 ml-4'>
                    <div className='text-sm xs:text-base text-nowrap mr-0.25 w-10 xs:w-12'>H: {formatTemp(day.tempmax, isMetric, false)}</div>
                    <div className='text-xs xs:text-sm text-nowrap w-10 xs:w-12 text-gray-400 ml-1 xs:mt-0.5'>L: {formatTemp(day.tempmin, isMetric, false)}</div>
                </div>
                <WeatherIcon className='w-10 h-10 xs:w-12 xs:h-12 ml-1 xs:ml-4 mr-2' iconName={day.icon} />
                <div className='hidden sm:block mr-auto text-sm text-gray-400 text-left'>{day.conditions}</div>
                
                {!isOpen &&
                    <IoIosArrowDown className='ml-auto' />
                }
                {isOpen && 
                    <IoIosArrowUp className='ml-auto'/>
                }
            </button>
            {isOpen && 
                <div className='pb-4'>
                    <p className='text-black text-sm xs:text-base'>{day.description}</p>
                    <div className='block text-sm xs:text-base sm:flex sm:flex-row sm:justify-between'>
                        <div className='text-gray-500'>
                            <p className='block sm:hidden'>{day.conditions}</p>
                            <p>Humidity: {Math.round(day.humidity)}%</p>
                            {day.preciptype &&
                                <p>Chance of {day.preciptype[0]}: {Math.round(day.precipprob)}%</p>
                            }
                            <p>Wind: {formatWindSpeed(day.windspeed, isMetric)} {formatWindDirection(day.winddir)}</p>
                            <p>UV Index: {day.uvindex}/11</p>
                            <p>Cloud cover: {day.cloudcover}%</p>
                        </div>
                        <div className='text-gray-500 text-left sm:text-right'>
                            <p>Sunrise: {moment.tz(day.sunriseEpoch * 1000, timezone).format('h:mm A z')}</p>
                            <p>Sunset: {moment.tz(day.sunsetEpoch * 1000, timezone).format('h:mm A z')}</p>

                        </div>
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
    isMetric: PropTypes.bool.isRequired,
};

export default DayCard;
