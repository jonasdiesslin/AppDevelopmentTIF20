import {useCurrentUserContext} from "../../Utils/userContext";
import React from "react";
import {ImageBackground, Text, TouchableOpacity, View} from "react-native";
import {CalendarDaysIcon} from "react-native-heroicons/outline";

//This is the apps landing page.
//The user is redirected here from the app's splash screen.
//Links to login, user registration, and user management (authentication) screens.
export default function Intitial({navigation}) {

    const {
        background: background,
    } = useCurrentUserContext();

    return (
        <ImageBackground source={background } className="flex-1">
            <View className="flex-col justify-center items-center relative top-40">

                <Text className="text-3xl bottom-7 font-bold text-white">Terminplaner</Text>
                <CalendarDaysIcon color="white" size={170} />

                <View className="top-36">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Anmelden', {image: background})}
                        className="border-2 border-stone-400 rounded-md w-80 h-11"
                    >
                        <Text className="self-center bottom-0 text-lg text-white p-1">Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Registrieren', {image: background})}
                        className="text-white top-2 border-2 bg-blue-300 border-blue-300 rounded-md  w-80 h-11">
                        <Text className="self-center bottom-0 text-lg text-white p-1">Registrieren</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="top-10 border-2  border-stone-400 rounded-md  w-80 h-11"  onPress={() => navigation.navigate('BenutzerauswahlAuth', {image: background})}>
                        <Text className="self-center bottom-0 text-lg text-white p-1">Benutzerverwaltung</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ImageBackground>
    )

}