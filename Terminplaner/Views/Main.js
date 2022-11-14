import {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View, TouchableOpacity, Alert } from 'react-native';

import {getCalendar} from '../Utils/Storage';
import Event from '../Components/Event'

import { useCurrentUserContext } from '../Utils/userContext';
import { fontScale } from "nativewind";

export default function Main({ navigation }) {

    const {
        loginFunction: setLoggedIn,
        userFunction: setCurrentUser,
        username: currentUser
    } = useCurrentUserContext();

    const [mainCalendar, setCalendar] = useState([]);

    async function loadCalendar(){
        const newCalendar = await getCalendar(currentUser);
        setCalendar(newCalendar);
    }

    //Load calendar initially
    loadCalendar();

    return (
        <>
            <View>
                <Button title="Logout" onPress={() => {
                    setCurrentUser(null);
                    setLoggedIn(false);//Now we'll go back to the login component
                }}/>
                <Button title="Kalendaransicht" onPress={() => {
                    //navigate to calendar view
                    navigation.navigate("CalendarView");
                }}/>

                <Text>Hallo, {currentUser}!</Text>
                <Text>Ihre Termine:</Text>

                <View>
                    {mainCalendar.map((calendarItem, index) => {
                        return (<Event title={calendarItem.title}
                                    start={calendarItem.start}
                                    end={calendarItem.end}
                                    key={index}/>)
                    })}
                </View>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={styles.touchableOpacityStyle} onPress={() => navigation.navigate("Appointment")}>
                <Text style={styles.FABTextStyle}>+</Text>
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
        alignContent: "center"
    },
    FABTextStyle: {
        fontSize: 50,
        color: "white",
        includeFontPadding: false,
    }
})

