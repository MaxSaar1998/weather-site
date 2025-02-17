function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Temp value is always in celcius
const formatTemp = (temp, isMetric, showUnits = true) => {
    if(isMetric){
        return `${Math.round(temp)}${showUnits ? '°C' : '°'}`
    } else {
        return `${Math.round(celsiusToFahrenheit(temp))}${showUnits ? '°F' : '°'}`
    }
}

export default formatTemp;