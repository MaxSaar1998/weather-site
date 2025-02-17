import PropTypes from 'prop-types';

import { metersPerSecondToKmPerHour } from '../utils/metersPerSecondToKmPerHour';

import WeatherIcon from './weatherIcon';


const customToolTip = ({ active, payload, label }) => {

    if (active && payload && payload.length) {
      return (
        <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-center'>
            <p className='text-lg font-bold'>{`${label}: `}</p>
            <p className='text-md'>{payload[0].payload.weather}</p>
            <WeatherIcon iconName={payload[0].payload.icon} />
            <p className='text-md'>{Math.round(payload[0].value)}°C</p>
            <p className='text-sm'>Humidity: {Math.round(payload[0].payload.humidity)}%</p>
            <p className='text-sm'>Wind: {
                Math.round(metersPerSecondToKmPerHour(payload[0].payload.wind))
            } km/h</p>
        
        </div>
      );
    }
  
    return null;
}
customToolTip.propTypes = {
active: PropTypes.bool,
payload: PropTypes.array,
label: PropTypes.string,
};

export default customToolTip;
