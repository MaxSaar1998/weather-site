function kmhToMph(kmh) {
    return kmh * 0.621371;
}

const formatWindSpeed = (wind, isMetric) => {

    if(isMetric){
        return `${Math.round(wind)}km/h`
    } else {
        return `${Math.round(kmhToMph(wind))}mph`
    }
}

export default formatWindSpeed;