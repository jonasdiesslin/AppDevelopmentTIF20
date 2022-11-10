import {useCurrentUserContext} from "../../Utils/userContext";
import React from "react";
import {authenticateUser} from "../../Utils/Authentication";
import {ImageBackground, Text, TouchableOpacity, View} from "react-native";
import {CalendarDaysIcon} from "react-native-heroicons/outline";

const image = { uri: "https://i.pinimg.com/originals/04/9f/83/049f836b439f058287cb23ed77b11bd0.jpg" };

export default function Intitial({navigation}) {


    return (
        <ImageBackground source={image} className="flex-1">
            <View className="flex-col justify-center items-center relative top-40">

                <Text className="text-3xl bottom-7 font-bold text-white">Terminplaner</Text>
                <CalendarDaysIcon color="white" size={170} />

                <View className="top-36">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Anmelden')}
                        className="border-2 border-stone-400 rounded-md p-2 w-80 h-11"
                    >
                        <Text className="self-center bottom-1 text-lg text-white">Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Registrieren')}
                        className="text-white top-2 border-2 bg-blue-300 border-blue-300 rounded-md p-2 w-80 h-11">
                        <Text className="self-center bottom-1 text-lg text-white">Registrieren</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="top-10 border-2  border-stone-400 rounded-md p-2 w-80 h-11"  onPress={() => navigation.navigate('Startseite')}><Text className="self-center bottom-1 text-lg text-white">Benutzerauswahl</Text></TouchableOpacity>
                </View>

            </View>
        </ImageBackground>
    )

}