import {useEffect, useState} from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { HeaderBackButton } from "@react-navigation/elements";

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
        console.log("Added listener.")
        const unsubscribe = navigation.addListener("beforeRemove", (e) => {
            //If this event was triggered by the user (e.g. by pressing the back button),
            //we replace it with one that goes back to the correct calendar month
            if(e.data.action.payload === undefined) {
                e.preventDefault();
                console.log("called event listener")
                navigation.navigate("CalendarView", {
                    yearSelected: timeSelected.year,
                    monthSelected: timeSelected.month
                });
            } else {
                //This event was triggered by us, i.e. it already contains the correct route parameters
                return;
            }
        });

        navigation.setOptions({
            headerLeft: () => {
                return (<HeaderBackButton
                            style={{
                                left: -15,
                                top: 0
                            }}
                            onPress={() => {
                                navigation.navigate("CalendarView", {
                                    yearSelected: timeSelected.year,
                                    monthSelected: timeSelected.month
                            });
                }}/>)
            }
        });

        return unsubscribe;
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
            <View className="flex-row items-center mb-5 mt-2">
                <TouchableOpacity onPress={() => oneDayBack()}>
                    <ChevronLeftIcon color="dodgerblue" size="30"/>
                </TouchableOpacity>
                <Text className="flex-auto text-center">{timeSelected.day}. {monthNames[timeSelected.month]} {timeSelected.year}</Text> 
                <TouchableOpacity onPress={() => oneDayForward()}>
                    <ChevronRightIcon color="dodgerblue" size="30"/>
                </TouchableOpacity>
            </View>
            
            <FlatList   data={eventsInDay}
                            renderItem={renderCalendarItem} 
                            keyExtractor={(item) => (`${item.start}${item.end}${item.title}`)}
                            style={{flexGrow: 1}}
                            ListEmptyComponent = {() => (<Text>Keine Termine an diesem Tag vorhanden.</Text>)}/>
        </View>
    )
}