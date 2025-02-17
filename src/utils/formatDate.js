//const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const formatDate = (date) => {
    //const day = weekdayNames[date.getDay()];

    const time = `${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;

    return `${time}`;
}

export const getFormattedDate = (date) => {

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return formattedDate.replace(/\d+/, (day) => day + getOrdinalSuffix(day));
}

function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) return 'th'; // Special case for 11-13
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

export const getMonthAndDay = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options); 
}
