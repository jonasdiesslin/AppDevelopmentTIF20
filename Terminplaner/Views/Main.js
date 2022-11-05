import {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { Button, Text, View } from 'react-native';

import {getCalendar} from '../Utils/Storage';
import Event from '../Components/Event'

export default function Main({loginFunction: setLoggedIn,
                              userFunction: setCurrentUser,
                              username: currentUser}) {
    const [mainCalendar, setCalendar] = useState([]);

    async function loadCalendar(){
        const newCalendar = await getCalendar(currentUser);
        setCalendar(newCalendar);
    }

    //Load 
    loadCalendar();

    return (
        <View>
            <Button title="Logout" onPress={() => {setCurrentUser(null); setLoggedIn(false);}}/>

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
    );
}

