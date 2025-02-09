import PropTypes from 'prop-types';

const customTooltip = ({ active, payload, label }) => {

    if (active && payload && payload.length) {
      return (
        <div className='bg-white rounded-md shadow-md p-3'>
          <p className='text-lg font-bold'>{`${label}: `}</p>
          <p className='text-lg'>{payload[0].value}°C</p>
          <p className='text-lg'>{payload[0].payload.humidity}</p>
          <p className='text-lg'>{payload[0].payload.wind}</p>

        
        {/* TODO: add weather icon here*/}
        </div>
      );
    }
  
    return null;
}
customTooltip.propTypes = {
active: PropTypes.bool,
payload: PropTypes.array,
label: PropTypes.string,
};

export default customTooltip;
