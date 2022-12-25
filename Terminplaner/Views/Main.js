import {useEffect, useState} from "react";
import React from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { PlusIcon, CalendarDaysIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useFocusEffect } from "@react-navigation/native"
import { ArrowLeftOnRectangleIcon } from "react-native-heroicons/outline";

import {getCalendar} from '../Utils/Storage';
import Event from '../Components/Event'

import { useCurrentUserContext } from '../Utils/userContext';
import { getEventsWithinRange, getEventsAfterDate, getTodayTimestamp, getStartTomorrowTimestamp, getEndTomorrowTimestamp, getSevenDaysHenceTimestamp } from "../Utils/Calendar";

//Construct a calendar separator (for displaying purposes only)
function getCalendarSeparator(text){
    return {
        isSeparator: true,
        text: text
    }
}

//The apps main page, where a user is redirected to after succesfull login
//NOTE: The only way back from here is to log out using our logout button.
//We therefore have to modify the default back-navigation behaviour a bit (explained further below).
export default function Main({ navigation }) {

    const {
        loginFunction: setLoggedIn,
        userFunction: setCurrentUser,
        username: currentUser
    } = useCurrentUserContext();

    const [mainCalendar, setMainCalendar] = useState([]);

    //Override back behaviour
    //The only way out of here is to log out using our custom logout button
    React.useEffect(
        () =>
          navigation.addListener('beforeRemove', (e) => {    
            //If there are no params, this event was triggered by the user clicking their device's back button
            // -> Prevent default behavior of leaving the screen

            //Use short-circuiting to prevent accessing undefined objects
            if (e.data.action.payload === undefined || e.data.action.payload.params === undefined){
                e.preventDefault();
            }
            //If there are params, this event was triggered by the logout button
            // -> we can let it pass
          }),
        []
      );

    //Override logout button behaviour
    //We need to do this in here so we can use navigation.navigate
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return  (
                    <TouchableOpacity onPress={() => {
                        setCurrentUser(null);
                        setLoggedIn(false);//Now we'll go back to the login component
                        navigation.navigate("Startseite", { reason: "logoutButtonPressed" }); 
                    }}>
                      <ArrowLeftOnRectangleIcon size="30" color="dodgerblue"/>
                    </TouchableOpacity>
                  )
            }
        });
    }, []);

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

    //Get various dates we'll need to display a separated calendar
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
        //Render separators and events appropriately
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
            <TouchableOpacity 
                activeOpacity={0.5}
                style={styles.touchableOpacityStyle}
                onPress={() => 
                    navigation.navigate("Appointment", {newEvent: true})
                }
            >
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
