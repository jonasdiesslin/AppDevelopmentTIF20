import {useState} from "react";
import { View, Text, Button, FlatList } from "react-native";

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
    const [eventsInDay, setEventsInDay] = useState([])

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
    getEventsInDay();

    function renderCalendarItem({item: calendarItem}){
        return (<Event calendarItem={calendarItem} navigation={navigation}/>)
    }

    return (
        <View style={{flex: 1}}>
            <Text>{timeSelected.day}.{monthNames[timeSelected.month]} {timeSelected.year}</Text> 
            <Button title="<" onPress={() => oneDayBack()}/>
            <Button title=">" onPress={()=> oneDayForward()}/>
            <FlatList   data={eventsInDay}
                            renderItem={renderCalendarItem} 
                            keyExtractor={(item) => (`${item.start}${item.end}${item.title}`)}
                            style={{flexGrow: 1}}
                            ListEmptyComponent = {() => (<Text>Keine Termine an diesem Tag vorhanden.</Text>)}/>
        </View>
    )
}
