//Selects all events from calendar that start at or after rangeStart and before rangeEnd
export function getEventsWithinRange(calendar, rangeStart, rangeEnd){
    function isInRange(event){
        const eventStart = new Date(event.start);
        if ((eventStart >= rangeStart) && (rangeEnd > eventStart)){
            return true;
        } else {
            return false;
        }
    }
    return calendar.filter(isInRange);
}

//Returns the date object for today, 0:00
export function getTodayTimestamp(){
    const now = new Date();
    const dateOfMonth = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    const startOfToday = new Date(year, month, dateOfMonth, 0, 0, 0); //startOfToday = 0:00:00 of today
    return startOfToday
}

//Returns the date object for tomorrow, 0:00
export function getStartTomorrowTimestamp(){
    const today = getTodayTimestamp();
    const oneDayMilliseconds = 24*60*60*1000;

    const startOfTomorrow = new Date(today.getTime() + oneDayMilliseconds);
    return startOfTomorrow;
}

//Returns the date object for tomorrow, 24:00
export function getEndTomorrowTimestamp(){
    const today = getTodayTimestamp();
    const oneDayMilliseconds = 24*60*60*1000;

    const endOfTomorrow = newDate(today.getTime() + (2 * oneDayMilliseconds))
    return endOfTomorrow;
}

//Takes in a number and pads with a leading zero if less than ten. Use for displaying minutes
export function padWithLeadingZero(input){
    if(input < 10)
        return "0" + input.toString()
    else
        return input.toString()
}
