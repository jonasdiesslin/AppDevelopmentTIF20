import {useState} from "react";
import { View, Text, Button } from "react-native";

import { getCalendar } from "../Utils/Storage";

import { getCurrentMonth, getCurrentYear, getDaysInMonth, monthNames } from "../Utils/Calendar";
import { useCurrentUserContext } from '../Utils/userContext';

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

    //Get all the events in the current month
    getCalendar(currentUser).then((calendar) => {

    })

    return (
        <View>
            <Text>{monthNames[timeSelected.month]} {timeSelected.year}</Text> 
            <Button title="<" onPress={() => oneMonthBack()}/>
            <Button title=">" onPress={()=> oneMonthForward()}/>
            <View>
                {dayList.map((day, index) => {
                    return (
                        <View key={index}>
                            <Text>{day}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}