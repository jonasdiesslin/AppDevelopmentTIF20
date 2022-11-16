import { View,Text, Button, Alert } from "react-native";

import { padWithLeadingZero } from "../Utils/Calendar";

//This component shows all details for an event. It is reachable by clicking on an event in the main view or the calendar view.
export default function EventDetails({ route, navigation }) {
    const { calendarItem } = route.params;
    const startDate = new Date(calendarItem.start);
    const endDate = new Date(calendarItem.end);

    //Nicely format start and end times
    const startTimeString = `${startDate.getHours()}:${padWithLeadingZero(startDate.getMinutes())}`;
    const endTimeString = `${endDate.getHours()}:${padWithLeadingZero(endDate.getMinutes())}`;

    //Nicely format calendar date
    const calendarDateString = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`;

    return (
        <View>
            <Text>{calendarItem.title}</Text>
            <Text>{startTimeString} - {endTimeString}</Text>
            <Text>{calendarDateString}</Text>
            <Text>
            Details: {(calendarItem.description !== "") ?
                                calendarItem.description :
                                "-"}
            </Text>
            <Button title="Löschen" onPress={() => Alert.alert("TBD")} />
        </View>
    )
}