import React, {useState} from 'react';
import {View,Text, TextInput, Alert, TouchableOpacity,ImageBackground} from "react-native";
import { UserCircleIcon } from "react-native-heroicons/outline";
import { authenticateUser } from '../../Utils/Authentication';

import { useCurrentUserContext } from '../../Utils/userContext';

//The component for the login screen
export default function SignIn({route, navigation}) {

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const {image} = route.params;

    const {
        loginFunction: setLoggedIn,
        userFunction: setCurrentUser
    } = useCurrentUserContext();



    async function attemptLogin(){
        const loginSuccessful = await authenticateUser(usernameInput, passwordInput)

        if(loginSuccessful){
            //Password was correct, log in this user
            setCurrentUser(usernameInput);
            setLoggedIn(true); //Now we'll switch over to the Main component
        } else {
            setUsernameInput("");
            setPasswordInput("");
            Alert.alert("Benutzername oder Passwort fehlerhaft.");
        }
    }


    return (
        <ImageBackground source={image} className="flex-1">
          <View className="flex-col justify-center items-center relative top-40">

                    <Text className="text-3xl bottom-7 font-bold text-white">Login</Text>
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
                    <TouchableOpacity className="top-10 bg-blue-300 rounded-md p-2 h-10 w-80"  onPress={attemptLogin}><Text className="self-center bottom-1 text-lg text-white">Login</Text></TouchableOpacity>
                </View>

            </View>
        </ImageBackground>
    )
}
