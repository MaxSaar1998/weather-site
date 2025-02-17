import { useState } from 'react'
import PropTypes from 'prop-types';

import { dateToWeekday } from '../utils/dateToWeekday';
import { getMonthAndDay } from '../utils/formatDate';
import WeatherIcon from '../components/weatherIcon';

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";




const DayCard = ({index, day}) => {

    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => {setIsOpen(!isOpen)}}
                className={`px-1 py-1 rounded-md w-full min-w-24 flex flex-row items-center
                `} key={index}>
                {/* Hack to get date in local time instead of utc */}
                <div className='flex flex-row items-center w-24'>
                    <div className='text-lg mr-2 w-9 text-left'>{dateToWeekday(new Date(day.datetime.replace(/-/g, "/")), true)}</div>
                    <div className='text-xs text-gray-500 mt-0.5'>{getMonthAndDay(new Date(day.datetime.replace(/-/g, "/")))}</div>
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
                <div>OPEN</div>
            }
        </div>
    )
}

DayCard.propTypes = {
    index: PropTypes.number.isRequired,
    day: PropTypes.shape({
        datetime: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        tempmax: PropTypes.number.isRequired,
        tempmin: PropTypes.number.isRequired,
        conditions: PropTypes.string.isRequired,
    }).isRequired,
};

export default DayCard;
