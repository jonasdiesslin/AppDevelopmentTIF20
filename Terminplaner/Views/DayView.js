import {useEffect, useState} from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";

import { getCalendar } from "../Utils/Storage";
import Event from '../Components/Event'

import { getEventsWithinRange, monthNames } from "../Utils/Calendar";
import { useCurrentUserContext } from '../Utils/userContext';

export default function DayView({ route, navigation }){
    //Extract user context
    const {
        username: currentUser
    } = useCurrentUserContext();

    //Extract from the params which day we're supposed to render
    const {
        yearSelected,
        monthSelected,
        daySelected
    } = route.params;

    //Store the time interval/the month currently displayed
    const [timeSelected, setTimeSelected] = useState({
        year: yearSelected,
        month: monthSelected,
        day: daySelected
    });
    //This state stores all the calendar events in the month currently selected
    const [eventsInDay, setEventsInDay] = useState([]);

    //Prevent default "back" behaviour
    //Go back to CalendarView as intended, but select the month of the day currently selected in this view
    useEffect(() => {
        navigation.addListener("beforeRemove", (e) => {
            //If this event was triggered by the user (e.g. by pressing the back button),
            //we replace it with one that goes back to the correct calendar month
            if(e.data.action.payload.params === undefined) {
                e.preventDefault();
                navigation.navigate("CalendarView", {
                    yearSelected: timeSelected.year,
                    monthSelected: timeSelected.month
                });
            } else {
                //This event was triggered by us, i.e. it already contains the correct route parameters
                return;
            }
        });
    }, [timeSelected]);

    function oneDayBack(){
        //Offload the hard parts to the standard library
        const dayBefore = new Date(timeSelected.year, timeSelected.month, timeSelected.day - 1);
        setTimeSelected({
            year: dayBefore.getFullYear(),
            month: dayBefore.getMonth(),
            day: dayBefore.getDate()
        });
    }

    function oneDayForward(){
        //Offload the hard parts to the standard library
        const dayBefore = new Date(timeSelected.year, timeSelected.month, timeSelected.day + 1);
        setTimeSelected({
            year: dayBefore.getFullYear(),
            month: dayBefore.getMonth(),
            day: dayBefore.getDate()
        });
    }

    //Get the calendar for the day currently displayed
    async function getEventsInDay(){
        const fullCalendar = await getCalendar(currentUser);
        const startOfDay = new Date(timeSelected.year, timeSelected.month, timeSelected.day, 0, 0, 0);
        const endOfDay = new Date(timeSelected.year, timeSelected.month, timeSelected.day, 23, 59, 59);
        const dayCalendar = getEventsWithinRange(fullCalendar, startOfDay, endOfDay)
        setEventsInDay(dayCalendar);
    }

    //Reload event list every time the user goes to a new day
    useEffect(() => {
        getEventsInDay();
    }, [timeSelected]);

    function renderCalendarItem({item: calendarItem}){
        return (<Event calendarItem={calendarItem} navigation={navigation}/>)
    }

    return (
        <View style={{flex: 1}}>
            <Text>{timeSelected.day}. {monthNames[timeSelected.month]} {timeSelected.year}</Text> 
            <TouchableOpacity onPress={() => oneDayBack()}>
                <ChevronLeftIcon color="dodgerblue"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => oneDayForward()}>
                <ChevronRightIcon color="dodgerblue"/>
            </TouchableOpacity>
            <FlatList   data={eventsInDay}
                            renderItem={renderCalendarItem} 
                            keyExtractor={(item) => (`${item.start}${item.end}${item.title}`)}
                            style={{flexGrow: 1}}
                            ListEmptyComponent = {() => (<Text>Keine Termine an diesem Tag vorhanden.</Text>)}/>
        </View>
    )
}


//<Button title="<" onPress={() => oneDayBack()}/>
//<Button title=">" onPress={()=> oneDayForward()}/>