import {FlatList, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {UserCircleIcon} from "react-native-heroicons/outline";
import React, {useState, useMemo, useEffect} from "react";
import {deleteUser} from "../../Utils/Authentication";
import {getAuthenticationInfo} from "../../Utils/Storage";



export default function UserChoice({route, navigation}) {

    const {image} = route.params;

    const [authInfo, setAuthInfo] = useState([]);

    async function getUser() {
        let res = await getAuthenticationInfo();
        setAuthInfo(res);
        console.log(authInfo);

    }
    //Reload event list every time action is performed
    useEffect(() => {
        getUser();
    }, [authInfo]);

    const isFormValid = useMemo(() => {
        return true
    }, []);


    async function attemptDelete(){
        const success = await deleteUser(username)

    }

    const Item = ({ title }) => (
        <View className="flex-auto flex-row justify-center top-24 mx-1 my-2 p-3 bg-transparent border-2 border-stone-400 rounded-md">
            <BouncyCheckbox/>
            <Text className="self-center text-2xl text-white text-center">{title} </Text>
            <View className="justify-self-end left-10"><UserCircleIcon color="white" size={50} /></View>
        </View>
    );

        const renderItem = ({ item }) => (
            <Item title={item.username} />
        );

    return (
        <ImageBackground source={image} className="flex-1">
                    <View className="flex-auto justify-center items-center relative pb-60">

                        <Text className="text-3xl top-28 font-bold text-white">Benutzerverwaltung</Text>

                        <View className="flex-1 top-28">
                            <FlatList data={authInfo}
                                      renderItem={renderItem}
                                      keyExtractor={item => item.username}
                                      className=""/>

                            {/*Check if User is chosen*/}
                            <TouchableOpacity disabled={!isFormValid} className="top-2 bg-blue-300 rounded-md h-10 w-80"  onPress={attemptDelete}>
                                <Text className="self-center bottom-1 text-lg text-white p-2">Löschen</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
        </ImageBackground>
    )
}

