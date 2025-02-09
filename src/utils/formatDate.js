const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const formatDate = (date) => {
    const day = weekdayNames[date.getDay()];

    const time = `${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;

    return `${day} ${time}`;
}