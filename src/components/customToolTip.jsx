import PropTypes from 'prop-types';

import WeatherIcon from './weatherIcon';
import formatTemp from '../utils/formatTemp';
import formatWindSpeed from '../utils/formatWindSpeed';
import formatWindDirection from '../utils/formatWindDirection';


const customToolTip = ({ active, payload, label, isMetric }) => {

    if (active && payload && payload.length) {
      return (
        <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-center'>
            <p className='text-base xs:text-lg font-bold'>{`${label}: `}</p>
            <p className='text-sm xs:text-base'>{payload[0].payload.weather}</p>
            <WeatherIcon iconName={payload[0].payload.icon} className={'w-12 h-12'} />
            <p className='text-sm xs:text-base'>{formatTemp(payload[0].value, isMetric)}</p>
            <p className='text-xs xs:text-sm'>Humidity: {Math.round(payload[0].payload.humidity)}%</p>
            <p className='text-xs xs:text-sm'>Wind: {
                formatWindSpeed(payload[0].payload.wind, isMetric)
              }
              {
                ` ${formatWindDirection(payload[0].payload.winddir)}`
              }
            </p>
        
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
