import PropTypes from 'prop-types';

import { metersPerSecondToKmPerHour } from '../utils/metersPerSecondToKmPerHour';

const customToolTip = ({ active, payload, label }) => {

    if (active && payload && payload.length) {
      return (
        <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-center'>
            <p className='text-lg font-bold'>{`${label}: `}</p>
            <p className='text-md'>{payload[0].payload.weather}</p>
            <img
                className='w-24 h-24 -mt-6 -mb-6'
                src={`https://openweathermap.org/img/wn/${payload[0].payload.icon}@2x.png`}
            />
            <p className='text-md'>{Math.round(payload[0].value)}°C</p>
            <p className='text-sm'>Humidity: {payload[0].payload.humidity}%</p>
            <p className='text-sm'>Wind: {
                metersPerSecondToKmPerHour(payload[0].payload.wind).toFixed(1)
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
