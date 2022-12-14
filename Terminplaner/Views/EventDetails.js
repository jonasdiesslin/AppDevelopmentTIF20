import React from "react"
import { View,Text, Button, Alert, TouchableOpacity } from "react-native";
import { ShareIcon, PencilSquareIcon, TrashIcon} from "react-native-heroicons/outline";
import { padWithLeadingZero, deleteEvent } from "../Utils/Calendar";
import { useCurrentUserContext } from '../Utils/userContext';

//This component shows all details for an event. It is reachable by clicking on an event in the main view or the day view.
export default function EventDetails({ route, navigation }) {
    console.log("EventDetails rendered");
    //Extract user context
    const {
        username: currentUser
    } = useCurrentUserContext();

    //Get the event to display from the route parameters
    let { calendarItem } = route.params;
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
                    className="flex-auto w-1 bg-dodgerblue p-2 rounded flex-row items-center mr-1"
                    onPress={() => {
                        navigation.navigate("Appointment", {
                            newEvent: false,
                            oldEvent: calendarItem
                        })
                    }}
                >
                    <PencilSquareIcon size="25" color="white"/>
                    <Text className="text-white ml-2">Bearbeiten</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-auto w-1 bg-dodgerblue p-2 rounded flex-row items-center mr-1"
                    onPress={() => Alert.alert("L??schen Best??tigen",
                        "Wollen Sie diesen Termin wirklich l??schen?", [
                        {
                            text: "L??schen",
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
                    <TrashIcon size="25" color="white"/>
                    <Text className="text-white ml-2">L??schen</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row m-1">
                <TouchableOpacity
                    className="flex-auto w-1 bg-dodgerblue p-2 rounded flex-row items-center mr-1"
                    onPress={() => {
                        navigation.navigate("ShareEvent", {
                            calendarItem: calendarItem
                        })
                    }}
                >
                    <ShareIcon size="25" color="white"/>
                    <Text className="text-white ml-2">Teilen</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
}