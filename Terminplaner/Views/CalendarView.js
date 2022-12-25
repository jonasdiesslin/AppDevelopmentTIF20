import {useEffect, useState} from "react";
import { View } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";

import { Calendar } from "react-native-calendars";

import { getCalendar } from "../Utils/Storage";

import { getCurrentDay, getDaysInMonth, getEventsWithinRange, padWithLeadingZero } from "../Utils/Calendar";
import { useCurrentUserContext } from '../Utils/userContext';

//This screen displays a calendar with marks on all dates which have events on them
export default function CalendarView({ route, navigation }){
    //Extract user context
    const {
        username: currentUser
    } = useCurrentUserContext();

    //Store the time interval/the month currently displayed
    const [timeSelected, setTimeSelected] = useState({
        year: route.params.yearSelected,
        month: route.params.monthSelected
    });
    //This state stores all the calendar events in the month currently selected
    const [eventsInMonth, setEventsInMonth] = useState([]);

    //Store the days of the month
    let dayList = [];
    for(let i = 1; i <= getDaysInMonth(timeSelected.year, timeSelected.month); i++){
        dayList.push(i);
    }

    function oneMonthBack(){
        //Count back one month
        let newMonth = timeSelected.month - 1;
        let newYear = timeSelected.year;
        if(newMonth === -1){
            //Go back to december of last year if necessary
            newMonth = 11;
            newYear = timeSelected.year - 1;
        }
        setTimeSelected({
            year: newYear,
            month: newMonth
        });
    }

    function oneMonthForward(){
        //Count back one month
        let newMonth = timeSelected.month + 1;
        let newYear = timeSelected.year;
        if(newMonth === 12){
            //Go forward to january of next year if necessary
            newMonth = 0;
            newYear = timeSelected.year + 1;
        }
        setTimeSelected({
            year: newYear,
            month: newMonth
        });
    }

    //Get the calendar for the month currently displayed
    async function getEventsInMonth(){
        const fullCalendar = await getCalendar(currentUser);
        const startOfMonth = new Date(timeSelected.year, timeSelected.month, 1, 0, 0, 0);
        const endOfMonth = new Date(timeSelected.year, timeSelected.month + 1, 0, 23, 59, 59);
        //NOTE: Day = 0 -> Last day of the previous month
        const monthCalendar = getEventsWithinRange(fullCalendar, startOfMonth, endOfMonth)
        setEventsInMonth(monthCalendar);
    }
    
    //Reload calendar every time the user switches to a new month
    useEffect(() => {
        getEventsInMonth();
    }, [timeSelected]);

    const [datesToMark, setDatesToMark] = useState({});
    function updateDatesToMark(){
        let newDatesToMark = {};
        //For every day in this month, see if there is at least one event scheduled on it.
        //If yes, we'll mark that day
        for (const date of dayList){
            const startOfDay = new Date(timeSelected.year, timeSelected.month, date, 0, 0, 0);
            const endOfDay = new Date(timeSelected.year, timeSelected.month, date, 23, 59, 59);
            const noEventsOnDay = getEventsWithinRange(eventsInMonth, startOfDay, endOfDay).length
            if (noEventsOnDay > 0){
                //NOTE: The marked-dates-object apparently requires timestrings with zero-padded, one-indexed days and months.
                //We'll therefore have to do a few calculations.
                const dateString = `${timeSelected.year}-${padWithLeadingZero(timeSelected.month + 1)}-${padWithLeadingZero(date)}`;
                newDatesToMark[dateString] = {marked: true};
            }
        }
        setDatesToMark(newDatesToMark);
    }

    //Mark days with events every time we've got new events (i.e. after the user has switched to a new month)
    useEffect(() => {
        updateDatesToMark();
    }, [eventsInMonth]);

    return (
        <View style={{flex: 1}}>
            <Calendar
                //Set up the initial date
                initialDate={`${route.params.yearSelected}-${padWithLeadingZero(route.params.monthSelected + 1)}-${padWithLeadingZero(getCurrentDay())}`} 
                //Set monday as the first day of the week
                firstDay={1}
                //Handle clicks on days by navigating to DayView (with the correct parameters)
                onDayPress={dayPressed => {
                    if(dayPressed.month !== (timeSelected.month + 1)){
                        setTimeSelected({
                            year: dayPressed.year,
                            month: (dayPressed.month - 1)
                        })
                    }
                    navigation.navigate("DayView", {
                        yearSelected: dayPressed.year,
                        monthSelected: dayPressed.month - 1,
                        daySelected: dayPressed.day
                    });
                }}
                //Handle going back one month
                onPressArrowLeft={subtractMonth => {
                    oneMonthBack();
                    subtractMonth();
                }}
                //Handle going forward one month
                onPressArrowRight={addMonth => {
                    oneMonthForward();
                    addMonth();
                }}
                //All days with events get marked with a dot
                markedDates={datesToMark}
                //Use custom backwards/forwards icons for consistency with DayView.js
                renderArrow={direction => (direction === "left") ? <ChevronLeftIcon color="dodgerblue"/> : <ChevronRightIcon color="dodgerblue"/>}
            />
        </View>
    )
}