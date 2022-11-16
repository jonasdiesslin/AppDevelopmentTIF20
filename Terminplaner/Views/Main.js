import {useState} from "react";
import { StyleSheet, Button, Text, View, TouchableOpacity, FlatList } from 'react-native';

import {getCalendar} from '../Utils/Storage';
import Event from '../Components/Event'

import { useCurrentUserContext } from '../Utils/userContext';
import { getEventsAfterDate, getTodayTimestamp } from "../Utils/Calendar";

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
    loadCalendar();

    function renderCalendarItem({item: calendarItem}){
        return (<Event calendarItem={calendarItem} navigation={navigation}/>)
    }

    return (
        <>
            <View style={{flex: 1}}>
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

                <FlatList data={mainCalendar} renderItem={renderCalendarItem} keyExtractor={(item) => `${item.start}${item.end}${item.title}`}/>                
            </View>
            <TouchableOpacity activeOpacity={0.5} style={styles.touchableOpacityStyle} onPress={() => navigation.navigate("Appointment")}>
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


