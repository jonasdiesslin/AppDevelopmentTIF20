import {useState} from "react";
import { View, Text, Button, FlatList, TouchableHighlight } from "react-native";

import { getCalendar } from "../Utils/Storage";
import Event from '../Components/Event'

import { getCurrentMonth, getCurrentYear, getDaysInMonth, getEventsWithinRange, monthNames } from "../Utils/Calendar";
import { useCurrentUserContext } from '../Utils/userContext';
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarView({ navigation }){
    //Extract user context
    const {
        username: currentUser
    } = useCurrentUserContext();

    //Store the time interval/the month currently displayed
    const [timeSelected, setTimeSelected] = useState({
        year: getCurrentYear(),
        month: getCurrentMonth()
    });
    //This state stores all the calendar events in the month currently selected
    const [eventsInMonth, setEventsInMonth] = useState([])

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
    //getEventsInMonth();

    function renderDay({item: day}){
        return (
            <TouchableHighlight onPress={() => {navigation.navigate("DayView", {
                yearSelected: timeSelected.year,
                monthSelected: timeSelected.month,
                daySelected: day
            })}}>
                <Text>{day}</Text>
            </TouchableHighlight>
        )
        /*
        const startOfToday = new Date(timeSelected.year, timeSelected.month, day, 0, 0, 0);
        const endOfToday = new Date(timeSelected.year, timeSelected.month, day, 23, 59, 59);
        const eventsInDay = getEventsWithinRange(eventsInMonth, startOfToday, endOfToday);
        return (
            <View>
                <Text>{day}</Text>
                {eventsInDay.map((calendarItem, index) => {
                                return (<Event calendarItem={calendarItem} navigation={navigation} key={`${calendarItem.start}${calendarItem.end}${calendarItem.title}`}/>)
                            })}
            </View>
        )
        */
    }

    return (
        <View style={{flex: 1}}>
            <Text>{monthNames[timeSelected.month]} {timeSelected.year}</Text> 
            <Button title="<" onPress={() => oneMonthBack()}/>
            <Button title=">" onPress={()=> oneMonthForward()}/>
            <FlatList data={dayList} renderItem={renderDay} keyExtractor={(item) => item.toString()}/>
        </View>
    )
}
