import {FlatList, ImageBackground, Text, TouchableOpacity, View, SafeAreaView} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {UserCircleIcon} from "react-native-heroicons/outline";
import React, {useState, useMemo, useEffect} from "react";
import {deleteUser} from "../../Utils/Authentication";
import {getAuthenticationInfo} from "../../Utils/Storage";

import { Alert } from "react-native";

import User from "../../Components/User";


export default function UserChoice({route, navigation}) {

    const {image} = route.params;

    const [authInfo, setAuthInfo] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    async function getUser() {
        let res = await getAuthenticationInfo();
        setAuthInfo(res);
        console.log(authInfo);

    }
    //Reload event list every time action is performed
    useEffect(() => {
        getUser();
    }, []);

    const isFormValid = useMemo(() => {
        return true
    }, []);


    async function attemptDelete(){
        const success = await deleteUser(username)

    }

    const Item = ({ title }) => {
        return (
            <View className="flex-auto flex-row justify-center top-24 mx-1 my-2 p-3 bg-transparent border-2 border-stone-400 rounded-md">
                <BouncyCheckbox/>
                <Text className="self-center text-2xl text-white text-center">{title} </Text>
                <View className="justify-self-end left-10"><UserCircleIcon color="white" size={50} /></View>
            </View>
        );
    }

    const renderItem = ({ item, index }) => {
        console.log(item)
        console.log(index)
        return (
            <View className="flex-auto flex-row justify-center mx-1 my-1 p-3 bg-transparent border-2 border-stone-400 rounded-md">
                <BouncyCheckbox
                size={35}
                onPress={(isPressed) => {
                    console.log("Checkbox pressed: " + isPressed)
                }}
            />
                <Text className="self-center text-2xl text-white text-center">{item.username} </Text>
                <View className="justify-self-end left-10"><UserCircleIcon color="white" size={50} /></View>         
            </View>
            
        );
    }

    return (
        <ImageBackground source={image} className="flex-1">
                    <View className="justify-center items-center relative pb-60">

                        <Text className="text-3xl top-28 font-bold text-white">Benutzerverwaltung</Text>

                        <SafeAreaView className="top-28">
                            <FlatList
                                //data={[{username: "a"}]}
                                className="mt-20" 
                                data={authInfo}
                                renderItem={renderItem}
                                keyExtractor={(item) => (item.username)}
                                style={{ flexGrow: 1 }}
                            />
                            
                            <TouchableOpacity disabled={!isFormValid} className="top-2 bg-blue-300 rounded-md h-10 w-80"  onPress={attemptDelete}>
                                <Text className="self-center bottom-1 text-lg text-white p-2">Löschen</Text>
                            </TouchableOpacity>
                        </SafeAreaView>

                    </View>
        </ImageBackground>
    )
}

/*
const renderItem = ({ item }) => (
        <Item title={item.username} />
    );

    {Check if User is chosen}
*/