import {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { Button, Text, View } from 'react-native';

import {getCalendar} from '../Utils/Storage';
import Event from '../Components/Event'

import { useCurrentUserContext } from '../Utils/userContext';

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

    //Load 
    loadCalendar();

    return (
        <View>
            <Button title="Logout" onPress={() => {
                setCurrentUser(null);
                setLoggedIn(false);//Now we'll back up to the login component
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
    );
}

