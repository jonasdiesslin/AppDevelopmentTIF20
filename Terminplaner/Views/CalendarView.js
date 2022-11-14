import {useState} from "react";
import { View, Text, Button } from "react-native";
import { getCurrentMonth, getCurrentYear, getDaysInMonth, monthNames } from "../Utils/Calendar";

export default function CalendarView({ navigation }){
    //Store the time interval/the month currently displayed
    const [timeSelected, setTimeSelected] = useState({
        year: getCurrentYear(),
        month: getCurrentMonth()
    });

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

    return (
        <View>
            <Text>{monthNames[timeSelected.month]} {timeSelected.year}</Text> 
            <Button title="<" onPress={() => oneMonthBack()}/>
            <Button title=">" onPress={()=> oneMonthForward()}/>
            <View>
                {dayList.map((day, index) => {
                    return (
                        <Text key={index}>{day}</Text>
                    )
                })}
            </View>
        </View>
    )
}