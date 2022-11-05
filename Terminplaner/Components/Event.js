import {View,Text, Button, TextInput, SafeAreaView, Alert} from "react-native";

import { padWithLeadingZero } from "../Utils/Calendar";

//This component can display basic information for a single calendar entry
export default function Event(props) {
    const startDate = new Date(props.start)
    const endDate = new Date(props.end)

    //Nicely format start and end times
    const startTimeString = `${startDate.getHours()}:${padWithLeadingZero(startDate.getMinutes())}`
    const endTimeString = `${endDate.getHours()}:${padWithLeadingZero(endDate.getMinutes())}`

    //Nicely format calendar date
    const calendarDateString = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`

    return (
        <View>
            <Text>{props.title}</Text>
            <Text>{startTimeString} - {endTimeString}</Text>
            <Text>{calendarDateString}</Text>
        </View>
    )
}