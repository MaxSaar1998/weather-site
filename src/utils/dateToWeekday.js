export const dateToWeekday = (date, shortened) => {
    const days = shortened ?
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']:
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}