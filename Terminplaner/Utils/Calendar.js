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

//Takes in a number and pads with a leading zero if less than ten. Use for displaying minutes.
export function padWithLeadingZero(input){
    if(input < 10)
        return "0" + input.toString()
    else
        return input.toString()
}

//Takes a year and a month (starting with January = 0) and returns the number of days in that month.
export function getDaysInMonth(year, month){
    const februaryDays = isLeapYear(year) ? 28 : 29;
    const dayCounts = [31, februaryDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return dayCounts[month];
}

//Exactly what is says in the name. Returns true if the given year is a leap year and false if not.
//Use at your own risk for years <= 0.
function isLeapYear(year){
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0); //Copied straight from StackOverflow, a sure sign of quality code
}

export const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
]