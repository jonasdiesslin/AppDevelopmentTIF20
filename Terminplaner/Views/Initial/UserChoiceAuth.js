import React, {useState} from 'react';
import {View,Text, TextInput, Alert, TouchableOpacity,ImageBackground, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard   } from "react-native";
import { UserCircleIcon } from "react-native-heroicons/outline";
import {authenticateManager} from '../../Utils/Authentication';

import { useCurrentUserContext } from '../../Utils/userContext';
import {CommonActions} from "@react-navigation/native";


//The component for the login screen
export default function UserChoiceAuth({route, navigation}) {

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [pin, setPin] = useState("");

    const {image} = route.params;

    const {
        loginFunction: setLoggedIn,
        userFunction: setCurrentUser
    } = useCurrentUserContext();



    async function attemptLogin(){
        //use commented await statement as soon gateway for authentication is available
        const loginSuccessful = await authenticateManager(usernameInput, passwordInput, pin)

        if(loginSuccessful){
            //Password was correct, switch to user choice
            Alert.alert(`Benutzer ${usernameInput} wurde erfolgreich zur Benutzerverwaltung authorisiert.`);
            setTimeout(()=> {
                //replaces the existing navigation state with the new one, preventing going back to the register screen
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Startseite' },
                            {
                                name: 'Benutzerauswahl', params: { image: image }
                            },
                        ],
                    })
                );
            }, 1200);

        } else {
            setUsernameInput("");
            setPasswordInput("");
            Alert.alert("Benutzername, Passwort oder Pin fehlerhaft.");
        }
    }


    return (

        <ImageBackground source={image} className="flex-1">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                enabled={Platform.OS === "ios"}
            >
                <TouchableWithoutFeedback className="flex-1" onPress={Keyboard.dismiss}>


                    <View className="flex-1 justify-center items-center relative pb-72">

                        <Text className="text-3xl bottom-7 font-bold text-white ">Benutzerverwaltung</Text>
                        <UserCircleIcon color="white" size={170} />

                        <View className="top-36">
                            <TextInput
                                placeholder="Benutzername"
                                placeholderTextColor="white"
                                autoComplete="username"
                                textContentType="username"
                                className="border-2 border-stone-400 rounded-md p-2 w-80 h-11"
                                style={{color: "white"}}
                                value={usernameInput}
                                onChangeText={setUsernameInput}
                            />
                            <TextInput
                                placeholder="Passwort"
                                placeholderTextColor="white"
                                autoComplete="password"
                                textContentType="password"
                                className="text-white top-2 border-2 border-stone-400 rounded-md p-2 w-80 h-11"
                                style={{color: "white"}}
                                secureTextEntry={true}
                                value={passwordInput}
                                onChangeText={setPasswordInput}
                            />
                            <TextInput
                                placeholder="Benutzerverwaltungspasswort"
                                placeholderTextColor="white"
                                autoComplete="sms-otp"
                                textContentType="oneTimeCode"
                                className="text-white top-4 border-2 border-stone-400 rounded-md p-2 w-80 h-11"
                                style={{color: "white"}}
                                secureTextEntry={true}
                                value={pin}
                                onChangeText={setPin}
                            />
                            <TouchableOpacity className="top-12 bg-blue-300 rounded-md h-10 w-80"  onPress={attemptLogin}>
                                <Text className="self-center bottom-0 text-lg text-white p-1">Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ImageBackground>



    )
}
