import {Alert, FlatList, Text, TouchableOpacity, View} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {UserCircleIcon} from "react-native-heroicons/outline";
import React, {useState, useEffect} from "react";
import {getAuthenticationInfo} from "../Utils/Storage";

import { padWithLeadingZero, addEvent } from "../Utils/Calendar";

//This screen allows a user to share an event with other users (i.e. add it to their calendars)
export default function ShareEvent({route, navigation}) {

    const {
        calendarItem
    } = route.params;

    const startDate = new Date(calendarItem.start);
    const endDate = new Date(calendarItem.end);

    //Nicely format start and end times
    const startTimeString = `${startDate.getHours()}:${padWithLeadingZero(startDate.getMinutes())}`;
    const endTimeString = `${endDate.getHours()}:${padWithLeadingZero(endDate.getMinutes())}`;

    //Nicely format calendar date
    const calendarDateString = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`;

    //Load initial user list
    useEffect(() => {
        getUsers();
    }, []);

    const [authInfo, setAuthInfo] = useState([]);

    //Stores which users are currently selected (i.e. have an active checkbox)
    let selectedUsers = [];

    async function getUsers() {
        let res = await getAuthenticationInfo();
        setAuthInfo(res);
    }

    //Copy event to all selected users' calendars
    async function doShare(){
        for (let i = 0; i < selectedUsers.length; i++) {
            //Copy event to this users calendar
            addEvent(selectedUsers[i], calendarItem);
            console.log("Copied to " + selectedUsers[i]);
        }

        Alert.alert(
            `Teilen erfolgreich`,
            `Termin erfolgreich mit ${selectedUsers.length} ${selectedUsers.length > 1 ? "Benutzern": "Benutzer"} geteilt.`,
            [
                {
                    text: "OK",
                    onPress: () => {
                        // Do nothing
                    }
                }
            ]
        );
    }

    //Validate inputs and ask the user for confirmation before sharing
    async function attemptShare(){
        if (selectedUsers.length === 0) {
            Alert.alert("Bitte wählen Sie mindestens einen Benutzer aus, mit dem Sie den Termin teilen wollen.");
        }else {
            let selectedUsersString = "";
            for (const i in selectedUsers){
                selectedUsersString = selectedUsersString + selectedUsers[i] + "\n";
            }

            Alert.alert(
                "Teilen bestätigen:",
                "Wollen Sie den Termin wirklich mit diesen Benutzern teilen?\n\n" + selectedUsersString,
                [
                    {
                        text: "Teilen",
                        onPress: () => {
                            doShare();
                        }
                        
                    },
                    {
                        text: "Abbrechen",
                        onPress: () => {
                            Alert.alert("Teilen abgebrochen");
                        }
                    }
                ]
            )
        }
    }

    const Item = ({ title }) => (
        <View className="flex-row flex-nowrap justify-evenly mx-1 my-2 p-3 border-2 border-dodgerblue rounded-md">
            <BouncyCheckbox
                className="self-center"
                fillColor="dodgerblue"
                size={30}
                onPress={(isChecked) => {
                    if(isChecked) {
                        selectedUsers.push(title);
                    } else {
                        //Remove this user from the selectedUsers list -> keep only users with different name
                        selectedUsers = selectedUsers.filter((username) => (username !== title));
                    }
                }}
            />
            <Text  onPress={()=> Alert.alert(title)} numberOfLines={1} className="self-center text-xl w-12 truncate">{title} </Text>
            <View className="self-center left-7"><UserCircleIcon color="dodgerblue" size={50} /></View>
        </View>
    );
                
    const renderItem = ({ item }) => (
        <Item className="flex-1 " title={item.username} />
    );
    return (
        <View className="flex-1">
                <View className="my-2 mx-3">
                    <Text className="text-2xl">{calendarItem.title}</Text>
                    <Text>{startTimeString} - {endTimeString}</Text>
                    <Text>{calendarDateString}</Text>
                </View>
                    <View className="flex-auto justify-center items-center relative pb-60">
                        <Text>Diesen Termin teilen mit:</Text>
                        <View className="flex-1 max-h-96 top-28">
                            <FlatList data={authInfo}
                                      renderItem={renderItem}
                                      keyExtractor={item => item.username}
                                      className=""/>

                            {/*Check if User is chosen*/}
                            <TouchableOpacity className="top-16 bg-dodgerblue rounded-md h-10 w-80"  onPress={attemptShare}>
                                <Text className="self-center bottom-1 text-lg text-white p-2">Termin teilen</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
        </View>
    )
}

