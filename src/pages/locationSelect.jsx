import {useState} from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@mui/material';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';


const LocationSelect = ({handleSearch}) => {
    const [textValue, setTextValue] = useState('');
    const [inputError, setInputError] = useState(null);

    const handleChange = (e) => {
        setTextValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (event.key === 'Enter') {
            // First do a basic input check
            if(textValue.length <= 1){
                setInputError('Location must be at least 2 characters');
            } else {
                handleSearch(textValue);
            }
        }
    }

    return (
        <div className='flex-1 w-full flex flex-col items-center justify-center'>
            <div className='bg-white p-2 -mt-24 rounded-lg w-md h-64
            shadow-lg flex flex-col justify-center items-center'>
            <div className='font-bold mb-2'>Enter a location to get started</div>

            <TextField
                id="standard-basic" label="Location" variant="standard"
                value={textValue}
                onChange={handleChange}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                onKeyDown={handleKeyPress} // Listen for key press events
                error={inputError}
                helperText={inputError ? inputError : ''}

            />
            </div>
        </div>
    )
}
LocationSelect.propTypes = {
    handleSearch: PropTypes.func.isRequired,
};

export default LocationSelect;