import {useEffect, useState} from "react";
import React from "react";
import { StyleSheet, Button, Text, View, SafeAreaView, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { PlusIcon, CalendarDaysIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useFocusEffect } from "@react-navigation/native"

import {getCalendar} from '../Utils/Storage';
import Event from '../Components/Event'

import { useCurrentUserContext } from '../Utils/userContext';
import { getEventsWithinRange, getEventsAfterDate, getTodayTimestamp, getStartTomorrowTimestamp, getEndTomorrowTimestamp, getSevenDaysHenceTimestamp } from "../Utils/Calendar";

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

    //Reload calendar on rerender
    useFocusEffect(
        React.useCallback(() => {
            loadCalendar();
            
            return () => {}
        }, [])
    );

    //Get various dates
    const startOfToday = getTodayTimestamp();
    const startOfTomorrow = getStartTomorrowTimestamp();
    const endOfTomorrow = getEndTomorrowTimestamp();
    const endOfWeek = getSevenDaysHenceTimestamp();

    //Construct a prettier calendar (with separators) for the display
    let finishedCalendar = [getCalendarSeparator("Heute")];
    finishedCalendar = finishedCalendar.concat(getEventsWithinRange(mainCalendar, startOfToday, startOfTomorrow));
    finishedCalendar = finishedCalendar.concat([getCalendarSeparator("Morgen")]);
    finishedCalendar = finishedCalendar.concat(getEventsWithinRange(mainCalendar, startOfTomorrow, endOfTomorrow));
    finishedCalendar = finishedCalendar.concat([getCalendarSeparator("Nächste sieben Tage")]);
    finishedCalendar = finishedCalendar.concat(getEventsWithinRange(mainCalendar, endOfTomorrow, endOfWeek));
    finishedCalendar = finishedCalendar.concat([getCalendarSeparator("Später")]);
    finishedCalendar = finishedCalendar.concat(getEventsAfterDate(mainCalendar, endOfWeek));

    function renderCalendarItem({item: calendarItem}){
        if(calendarItem.isSeparator === true) {
            return (<Text className="bg-gray-300 p-1 mb-1">
                        {calendarItem.text}
                    </Text>)
        } else {
            return (<Event calendarItem={calendarItem} navigation={navigation}/>)
        }
    }

    return (
        <>
            <SafeAreaView style={{flex: 1}}>

                <View className="flex-row m-2">
                    <TouchableOpacity 
                        className="flex-auto w-1 bg-dodgerblue p-2 rounded flex-row items-center mr-1"
                        onPress={() => {
                            //navigate to calendar view
                            navigation.navigate("CalendarView", {
                                yearSelected: getTodayTimestamp().getFullYear(),
                                monthSelected: getTodayTimestamp().getMonth()
                            });
                    }}>
                        <CalendarDaysIcon size="25" color="white"/>
                        <Text className="text-white ml-2">Kalenderansicht</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-auto w-1 bg-dodgerblue p-2 rounded flex-row items-center ml-1"
                        onPress={() => {
                            navigation.navigate("Search");
                    }}>
                        <MagnifyingGlassIcon size="25" color="white"/>
                        <Text className="text-white ml-2">Suche</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-2 p-1 flex-1">
                    <Text>Hallo, {currentUser}!</Text>
                    <Text className="mb-2">Ihre Termine:</Text>

                        <FlatList 
                            className=""  
                            data={finishedCalendar}
                            renderItem={renderCalendarItem} 
                            keyExtractor={(item) => ((item.isSeparator === true) ? `${item.text}` : `${item.start}${item.end}${item.title}`)}
                            style={{flexGrow: 1}}/>
                    
                </View>
                
            </SafeAreaView>
            <TouchableOpacity activeOpacity={0.5} style={styles.touchableOpacityStyle} onPress={() => navigation.navigate("Appointment")}>
                <PlusIcon color="white" size="50"/>
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

/*
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
*/