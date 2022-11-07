import React, {useState} from 'react';
import {View,Text, Button, TextInput, SafeAreaView, Alert} from "react-native";

import { authenticateUser } from '../Utils/Authentication';

import { useCurrentUserContext } from '../Utils/userContext';

//The component for the login screen
export default function SignIn() {
    
    const {
        loginFunction: setLoggedIn,
        userFunction: setCurrentUser
    } = useCurrentUserContext();

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

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
        <View className="relative">
            <View  className="justify-center absolute top-20"><Text className="absolute">Terminplaner-Login</Text></View >

            <SafeAreaView>
            <TextInput
                placeholder="Benutzername"
                autoComplete="username"
                textContentType="username"
                value={usernameInput}
                onChangeText={setUsernameInput}
            />
            <TextInput
                placeholder="Passwort"
                autoComplete="password"
                textContentType="password"
                secureTextEntry={true}
                value={passwordInput}
                onChangeText={setPasswordInput}
            />
        </SafeAreaView>
            <Button title="Login" onPress={attemptLogin} />
        </View>
    )
}
