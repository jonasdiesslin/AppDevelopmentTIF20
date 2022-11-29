import {useEffect, useState} from "react";
import { StyleSheet, Button, Text, View, SafeAreaView, TouchableOpacity, FlatList, Image } from 'react-native';

import {getCalendar} from '../Utils/Storage';
import Event from '../Components/Event'

import { useCurrentUserContext } from '../Utils/userContext';
import { getEventsWithinRange, getEventsAfterDate, getTodayTimestamp, getStartTomorrowTimestamp, getEndTomorrowTimestamp, getSevenDaysHenceTimestamp } from "../Utils/Calendar";

const plusImage = require("../public/images/iconmonstr-plus-thin-240.png")

function getCalendarSeparator(text){
    return {
        isSeparator: true,
        text: text
    }
}

export default function Main({ navigation }) {

    const {
        loginFunction: setLoggedIn,
        userFunction: setCurrentUser,
        username: currentUser
    } = useCurrentUserContext();

    const [mainCalendar, setMainCalendar] = useState([]);

    async function loadCalendar(){
        const fullCalendar = await getCalendar(currentUser);
        const startOfToday = getTodayTimestamp();
        const newCalendar = getEventsAfterDate(fullCalendar, startOfToday);
        setMainCalendar(newCalendar);
    }

    //Load calendar initially
    useEffect(() => {
        loadCalendar();
    }, [])

    //Get various dates
    const startOfToday = getTodayTimestamp();
    const startOfTomorrow = getStartTomorrowTimestamp();
    const endOfTomorrow = getEndTomorrowTimestamp();
    const endOfWeek = getSevenDaysHenceTimestamp();

    //Construct a prettier calendar (with separators) for the display
    let finishedCalendar = [getCalendarSeparator("Heute:")];
    finishedCalendar = finishedCalendar.concat(getEventsWithinRange(mainCalendar, startOfToday, startOfTomorrow));
    finishedCalendar = finishedCalendar.concat([getCalendarSeparator("Morgen:")]);
    finishedCalendar = finishedCalendar.concat(getEventsWithinRange(mainCalendar, startOfTomorrow, endOfTomorrow));
    finishedCalendar = finishedCalendar.concat([getCalendarSeparator("Nächste sieben Tage:")]);
    finishedCalendar = finishedCalendar.concat(getEventsWithinRange(mainCalendar, endOfTomorrow, endOfWeek));
    finishedCalendar = finishedCalendar.concat([getCalendarSeparator("Später:")]);
    finishedCalendar = finishedCalendar.concat(getEventsAfterDate(mainCalendar, endOfWeek));

    function renderCalendarItem({item: calendarItem}){
        if(calendarItem.isSeparator === true) {
            return (<Text>{calendarItem.text}</Text>)
        } else {
            return (<Event calendarItem={calendarItem} navigation={navigation}/>)
        }
    }

    return (
        <>
            <SafeAreaView style={{flex: 1}}>
                <View className="mb-2">
                    <Button title="Logout" onPress={() => {
                        setCurrentUser(null);
                        setLoggedIn(false);//Now we'll go back to the login component
                    }}/>
                </View>

                <View className="mb-2">
                    <Button title="Kalendaransicht" onPress={() => {
                        //navigate to calendar view
                        navigation.navigate("CalendarView", {
                            yearSelected: getTodayTimestamp().getFullYear(),
                            monthSelected: getTodayTimestamp().getMonth()
                        });
                    }}/>
                </View>
                    
                <View className=""></View>
                    <Button title="Suche" onPress={() => {
                        navigation.navigate("Search");
                    }}/>
                <View/>

                <View className="mt-4">
                    <Text>Hallo, {currentUser}!</Text>
                    <Text>Ihre Termine:</Text>

                    <FlatList   data={finishedCalendar}
                                renderItem={renderCalendarItem} 
                                keyExtractor={(item) => ((item.isSeparator === true) ? `${item.text}` : `${item.start}${item.end}${item.title}`)}
                                style={{flexGrow: 1}}/>
                </View>
                
            </SafeAreaView>
            <TouchableOpacity activeOpacity={0.5} style={styles.touchableOpacityStyle} onPress={() => navigation.navigate("Appointment")}>
                <Image source={plusImage} style={{ width: 40, height: 40}}/>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    touchableOpacityStyle: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor:'dodgerblue',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    FABTextStyle: {
        fontSize: 50,
        color: "white",
        includeFontPadding: false,
    }
})


// <Text style={styles.FABTextStyle}>+</Text>