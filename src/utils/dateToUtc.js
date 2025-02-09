export const dateToUtc = (date) => {
    const localDate = new Date(date);

    const utcDate = new Date(Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes(),
        localDate.getSeconds()
    ));
    return utcDate;
}

