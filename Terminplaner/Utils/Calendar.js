//Various utilities for dealing with calendars and times
import {LocaleConfig} from 'react-native-calendars';

import { getCalendar, storeCalendar } from "./Storage";
import { scheduleEventNotification, cancelNotification } from './Notifications';

//Set up locale for the calendar view
LocaleConfig.locales['de'] = {
  monthNames: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
  ],
  monthNamesShort: ['Jan.', 'Feb.', 'Mär', 'Apr.', 'Mai', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],
  dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  dayNamesShort: ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
  today: "Heute"
};
LocaleConfig.defaultLocale = 'de';

//Various functions for dealing with calendar arrays

//Helper function to check if two events are the same
function eventEqualityCheck(event1, event2){
    return (
        (event1.title === event2.title) &&
        (event1.start === event2.start) &&
        (event1.end === event2.end) &&
        (event1.description === event2.description)
    )
}

//Add an event to a user's calendar
export async function addEvent(username, newEvent){
    let calendar = await getCalendar(username);

    //Deep-copy newEvent so we can later modify it, if necessary
    let eventToStore = {
        start: newEvent.start,
        end: newEvent.end,
        notification: newEvent.notification,
        title: newEvent.title,
        description: newEvent.description
    };

    if(newEvent.notification){
        const id = await scheduleEventNotification(newEvent, username);
        eventToStore.notificationInfo = id;
    }
    //Check if such an event already exists so we don't create duplicates
    for (const i in calendar){
        if (eventEqualityCheck(calendar[i], newEvent)){
            return;
        }
    }
    //No equal event found -> we can add it to the calendar
    calendar.push(eventToStore);
    await storeCalendar(username, calendar);
}

//Remove an event from a user's calendar
export async function deleteEvent(username, eventToDelete){
    let calendar = await getCalendar(username);
    //Look through the calendar to find similar events
    let indexToDelete = -1;
    for (const i in calendar){
        if (eventEqualityCheck(calendar[i], eventToDelete)){
            indexToDelete = i;
            break;
        }
    }
    //Delete the event (and its notification, if any) and store new calendar
    //NOTE: This function is only called from EventDetails with an existing event as argument
    //  -> we will always find eventToDelete in the calendar, unless something else has gone (badly) wrong
    if(eventToDelete.notification && (eventToDelete.notificationInfo !== "")){
        cancelNotification(eventToDelete.notificationInfo);
    }

    calendar.splice(indexToDelete, 1);
    await storeCalendar(username, calendar)
}

//Selects all events from calendar that start at or after rangeStart and before rangeEnd
//and sorts them for good measure
export function getEventsWithinRange(calendar, rangeStart, rangeEnd){
    //Check if an event is in the given range
    function isInRange(event){
        const eventStart = new Date(event.start);
        if ((eventStart >= rangeStart) && (rangeEnd > eventStart)){
            return true;
        } else {
            return false;
        }
    }
    //Compare events for sorting
    function compareEvents(eventA, eventB){
        return new Date(eventA.start) - new Date(eventB.start);
    }

    return calendar.filter(isInRange).sort(compareEvents);
}

//Selects all events from calendar that start at or after startDate
//and sorts them for good measure
export function getEventsAfterDate(calendar, startDate){
    function isInRange(event){
        const eventStart = new Date(event.start);
        if (eventStart >= startDate){
            return true;
        } else {
            return false;
        }
    }
    //Compare events for sorting
    function compareEvents(eventA, eventB){
        return new Date(eventA.start) - new Date(eventB.start);
    }

    return calendar.filter(isInRange).sort(compareEvents);
}

//Various utilities for handling dates

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

    const endOfTomorrow = new  Date(today.getTime() + (2 * oneDayMilliseconds))
    return endOfTomorrow;
}

//Returns the date object for seven days after today, 24:00
export function getSevenDaysHenceTimestamp(){
    const today = getTodayTimestamp();
    const oneDayMilliseconds = 24*60*60*1000;

    const endOfTomorrow = new  Date(today.getTime() + (7 * oneDayMilliseconds))
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
    const februaryDays = isLeapYear(year) ? 29 : 28;
    const dayCounts = [31, februaryDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return dayCounts[month];
}

//Exactly what is says in the name. Returns true if the given year is a leap year and false if not.
//Use at your own risk for years <= 0.
function isLeapYear(year){
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0); //Copied straight from StackOverflow, a sure sign of quality code
}

//Month name constants
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

//Accessor functions for various parts of the current date
export function getCurrentYear(){
    const now = new Date();
    return now.getFullYear();
}

export function getCurrentMonth(){
    const now = new Date();
    return now.getMonth();
}

export function getCurrentDay(){
    const now = new Date();
    return now.getDate();
}