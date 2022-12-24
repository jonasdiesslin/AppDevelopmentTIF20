import {Alert, FlatList, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {UserCircleIcon} from "react-native-heroicons/outline";
import React, {useState, useEffect} from "react";
import {deleteUser} from "../../Utils/Authentication";
import {getAuthenticationInfo} from "../../Utils/Storage";



export default function UserChoice({route, navigation}) {

    const {image} = route.params;

    //Reload event list every time action is performed
    useEffect(() => {
        getUsers();
    }, []);

    const [authInfo, setAuthInfo] = useState([]);
    //console.log(authInfo);
    let selectedUsers = [];

    async function getUsers() {
        let res = await getAuthenticationInfo();
        setAuthInfo(res);
    }

    async function doDelete(){
        for (let i = 0; i < selectedUsers.length; i++) {
            await deleteUser(selectedUsers[i])
        }

        Alert.alert(
            `Löschen erfolgreich`,
            `${selectedUsers.length} Benutzer erfolgreich gelöscht`,
            [
                {
                    text: "OK",
                    onPress: () => {
                        getUsers();
                    }
                }
            ]
        );
    }

    async function attemptDelete(){
        if (selectedUsers.length === 0) {
            Alert.alert("Bitte wählen Sie einen Benutzer aus, den Sie entfernen möchten.");
        }else {
            let selectedUsersString = "";
            for (const i in selectedUsers){
                selectedUsersString = selectedUsersString + selectedUsers[i] + "\n";
            }

            Alert.alert(
                "Löschen bestätigen:",
                "Wollen Sie diese Benutzer wirklich löschen?\n\n" + selectedUsersString,
                [
                    {
                        text: "Löschen",
                        onPress: () => {
                            doDelete();
                        }
                        
                    },
                    {
                        text: "Abbrechen",
                        onPress: () => {
                            Alert.alert("Löschvorgang abgebrochen");
                        }
                    }
                ]
            )
        }
    }

    const Item = ({ title }) => (
        <View className="flex-row flex-nowrap justify-evenly mx-1 my-2 p-3 bg-transparent border-2 border-stone-400 rounded-md">
            <BouncyCheckbox
                className="self-center"
                onPress={(isChecked) => {
                    if(isChecked) {
                        //console.log(`User ${title} checked.`);
                        selectedUsers.push(title);
                        //console.log(selectedUsers);
                    } else {
                        //console.log(`User ${title} unchecked.`);
                        //Remove this user from the selectedUsers list -> keep only users with different name
                        selectedUsers = selectedUsers.filter((username) => (username !== title));
                        //console.log(selectedUsers);
                    }
                }}
            />
            <Text  onPress={()=> Alert.alert(title)} numberOfLines={1} className="self-center text-xl text-white w-12 truncate">{title} </Text>
            <View className="self-center left-7"><UserCircleIcon color="white" size={50} /></View>
        </View>
    );
                
    const renderItem = ({ item }) => (
        <Item className="flex-1 " title={item.username} />
    );
    return (
        <ImageBackground source={image} className="flex-1">
                    <View className="flex-auto justify-center items-center relative pb-60">

                        <Text className="text-3xl top-2 font-bold text-white">Benutzerverwaltung</Text>

                        <View className="flex-1 max-h-96 top-28">
                            <FlatList data={authInfo}
                                      renderItem={renderItem}
                                      keyExtractor={item => item.username}
                                      className=""/>

                            {/*Check if User is chosen*/}
                            <TouchableOpacity className="top-16 bg-blue-300 rounded-md h-10 w-80"  onPress={attemptDelete}>
                                <Text className="self-center bottom-1 text-lg text-white p-2">Löschen</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
        </ImageBackground>
    )
}

