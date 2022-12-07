import { View,Text, Button, Alert, TouchableOpacity } from "react-native";

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
            <View className="my-2 mx-3">
                <Text className="text-2xl">{calendarItem.title}</Text>
                <Text>{startTimeString} - {endTimeString}</Text>
                <Text>{calendarDateString}</Text>
                <Text>
                    Details: {"\n"}{(calendarItem.description !== "") ?
                                    calendarItem.description :
                                    "-"}
                </Text>
            </View>
            
            <View className="flex-row m-1">
                <TouchableOpacity
                    className="flex-auto items-center bg-dodgerblue p-2 mx-1 rounded"
                    onPress={() => Alert.alert("TBD")}
                >
                    <Text className="text-white">Bearbeiten</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-auto items-center bg-dodgerblue p-2 mx-1 rounded"
                    onPress={() => Alert.alert("Löschen Bestätigen",
                        "Wollen Sie diesen Termin wirklich löschen?", [
                        {
                            text: "Löschen",
                            onPress: () => {
                                deleteEvent(currentUser, calendarItem);
                                navigation.goBack();
                            } 
                        },
                        {
                            text: "Abbrechen"
                        }
                    ])}
                >
                    <Text className="text-white">Löschen</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
}