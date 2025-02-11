import clouds from "../assets/clouds96.png";
import heavyRain from "../assets/heavyRain96.png";
import lightRain from "../assets/lightRain96.png";
import lightSnow from "../assets/lightSnow96.png";
import partlyCloudy from "../assets/partlyCloudy96.png";
import storm from "../assets/storm96.png";
import sun from "../assets/sun96.png";
import snow from "../assets/snow96.png";


const weatherIcon = ({iconName}) => {
    var imgsrc = '';
    switch (iconName) {
        case 'cloudy':
            imgsrc = clouds;
            break;
        case 'clear-day':
            imgsrc = sun;
            break;
        case 'partly-cloudy-day':
            imgsrc = partlyCloudy;
            break;
        case 'snow':
            imgsrc = snow;
            break;
        case 'rain':
            imgsrc = heavyRain;
            break;

        // Not sure if these icon names below match anything
        case 'storm':
            imgsrc = storm;
            break;

        case 'heavy-rain':
            imgsrc = heavyRain;
            break;

        case 'light-rain':
            imgsrc = lightRain;
            break;
        case 'light-snow':
            imgsrc = lightSnow;
            break;
        default:
            console.log("NO ICON FOR:" + iconName);
            imgsrc = sun;
            break;
        
    }

    return <img
        src={imgsrc}
        className='w-12 h-12'
    />;
} 

export default weatherIcon;