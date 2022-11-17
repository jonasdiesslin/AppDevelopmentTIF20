import { View,Text, Button, Alert } from "react-native";

import { padWithLeadingZero, deleteEvent } from "../Utils/Calendar";
import { useCurrentUserContext } from '../Utils/userContext';

//This component shows all details for an event. It is reachable by clicking on an event in the main view or the calendar view.
export default function EventDetails({ route, navigation }) {
    //Extract user context
    const {
        username: currentUser
    } = useCurrentUserContext();

    //Get the event to display from the route parameters
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
            <Button title="Bearbeiten" onPress={() => Alert.alert("TBD")} />
            <Button title="Löschen" onPress={() => Alert.alert("Löschen Bestätigen",
                "Wollen Sie diesen Termin wirklich löschen?", [
                {
                    text: "Löschen",
                    onPress: () => {
                        //deleteEvent(currentUser, calendarItem);
                        navigation.goBack();
                    } 
                },
                {
                    text: "Abbrechen"
                }
            ])} />
        </View>
    )
}