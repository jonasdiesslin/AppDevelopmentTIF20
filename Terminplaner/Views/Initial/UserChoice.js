import {Alert, FlatList, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {UserCircleIcon} from "react-native-heroicons/outline";
import React, {useState, useMemo, useEffect} from "react";
import {deleteUser} from "../../Utils/Authentication";
import {getAuthenticationInfo} from "../../Utils/Storage";



export default function UserChoice({route, navigation}) {

    const {image} = route.params;

    //Reload event list every time action is performed
    useEffect(() => {
        getUser();
    });

    const [authInfo, setAuthInfo] = useState([]);
    const [deletetion, setDeletetion] = useState(false);

    let selectedUserList = [];

    async function getUser() {
        let res = await getAuthenticationInfo();
        setAuthInfo(res);
        setDeletetion(false)
        console.log(authInfo);
    }



    async function attemptDelete(){
        if (selectedUserList.length === 0) {
            Alert.alert("Bitte wählen Sie einen Benutzer aus, den Sie entfernen möchten.");
        }else {
            for (let i = 0; i < selectedUserList.length; i++) {
                await deleteUser(selectedUserList[i])
            }
            setDeletetion(true)
            Alert.alert(`Ausgewählte Benutzer wurden erfolgreich entfernt.`);
        }
    }

    const Item = ({ title }) => (
        <View className="flex-row flex-nowrap justify-evenly mx-1 my-2 p-3 bg-transparent border-2 border-stone-400 rounded-md">
            <BouncyCheckbox
                className="self-center"
                onPress={() => {
                    if(selectedUserList.length !==0){
                    selectedUserList.forEach((item) => {
                        if (item !== title ) {
                            selectedUserList.push(title)
                        }else{
                            selectedUserList.splice(selectedUserList.indexOf(title), 1)
                        }})
                }else{
                        selectedUserList.push(title)
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
                            <TouchableOpacity className="top-16 bg-blue-300 rounded-md h-10 w-80"  onPress={attemptDelete}><Text className="self-center bottom-1 text-lg text-white p-2">Löschen</Text></TouchableOpacity>
                        </View>

                    </View>
        </ImageBackground>
    )
}

