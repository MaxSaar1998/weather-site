// This file takes the openweathermap weather type id and returns a descriptive string
// 'https://openweathermap.org/weather-conditions'

export const weatherName = (weatherId) => {
    if(weatherId){ //TODO: populate with all of the weather types
        switch(weatherId){
            // 200s
            case 200:
                return 'Thunderstorms with light rain';
            case 201:
                return 'Thunderstorms with rain';
            case 202:
                return 'Thunderstorms with heavy rain';
            case 210: 
                return 'Light thunderstorms';
            case 211:
                return 'Thunderstorms';
            case 212:
                return 'Heavy thunderstorms';
            case 221: 
                return 'Thunderstorms';
            case 230:
                return 'Thunderstorms with light drizzle';
            case 231: 
                return 'Thunderstorms with drizzle';
            case 232:
                return 'Thunderstorms with heavy drizzle';

            // 300s
            case 300:
                return 'Light drizzle';
            case 301:
                return 'Drizzle';
            case 302:
                return 'Heavy drizzle';
            case 310: 
                return 'Light drizzle rain';
            case 311:
                return 'Drizzle rain';
            case 312:
                return 'Heavy drizzle rain';
            case 313:
                return 'Shower rain and drizzle';
            case 314:
                return 'Heavy shower rain and drizzle';
            case 321:
                return 'Shower drizzle';
            
            // 500s
            case 500:
                return 'Light rain';
            case 501:
                return 'Moderate rain';
            case 502:
                return 'Heavy rain';
            case 503:
                return 'Very heavy rain';
            case 504:
                return 'Extreme rain';
            case 511:
                return 'Freezing rain';
            case 520:
                return 'Light shower rain';
            case 521:
                return 'Shower rain';
            case 522:
                return 'Heavy shower rain';
            case 531:
                return 'Ragged shower rain';
    
            // 600s
            case 600:
                return 'Light snow';
            case 601:
                return 'Snow';
            case 602:
                return 'Heavy snow';
            case 611:
                return 'Sleet';
            case 612:
                return 'Light sleet';
            case 613:
                return 'Shower sleet';
            case 615:
                return 'Light rain and snow';
            case 616:
                return 'Rain and snow';
            case 620:
                return 'Light shower snow';
            case 621:
                return 'Shower snow';
            case 622:
                return 'Heavy shower snow';
            // 700s
            case 701:
                return 'Mist';
            case 711:
                return 'Smoke';
            case 721:
                return 'Haze';
            case 731:
                return 'Sand, dust whirls';
            case 741:
                return 'Fog';
            case 751:
                return 'Sand';
            case 761:
                return 'Dust';
            case 762:
                return 'Volcanic ash';
            case 771:
                return 'Squalls';
            case 781:
                return 'Tornado';

            // 800s
            case 800:
                return 'Clear';
            case 801:
                return 'Slightly cloudy';
            case 802:
                return 'Scattered clouds';
            case 803:
                return 'Cloudy';
            case 804:
                return 'Very cloudy';
            default:
                return 'Clear';
        }
    }
}