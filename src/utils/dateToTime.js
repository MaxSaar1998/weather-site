export const dateToTime = (date) => {
    return `${(date.getHours() % 12 || 12) + ':'
        + date.getMinutes().toString().padStart(2, '0') + ' '
        + (date.getHours > 12 ? 'PM' : 'AM')
      }`
}