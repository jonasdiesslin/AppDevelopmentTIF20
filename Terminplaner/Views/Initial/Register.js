import {Alert, ImageBackground, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import {UserCircleIcon} from "react-native-heroicons/outline";
import React, {useState, useMemo} from "react";
import {createUser} from "../../Utils/Authentication";
import {checkIfUsernameExists} from "../../Utils/Authentication";
import { CommonActions } from '@react-navigation/native';


export default function Register({route, navigation}) {

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordInputRepeat, setpasswordInputRepeat] = useState("");

    const {image} = route.params;

    const isFormValid = useMemo(() => {
        return usernameInput.length > 0 && (passwordInput.length > 0 && passwordInputRepeat.length > 0)
    }, [usernameInput, passwordInput, passwordInputRepeat]);

    async function attemptRegister(){
        if (await checkIfUsernameExists(usernameInput)) {
            Alert.alert("Benutzername bereits vergeben.");
        }
        else if(passwordInput === passwordInputRepeat){
            const registerSuccessful = await createUser(usernameInput, passwordInput)
            if(registerSuccessful){
                //register was correct, switch to login
                Alert.alert(`Benutzer ${usernameInput} wurde erfolgreich registriert. Bitte melden Sie sich an.`);
                setTimeout(()=> {
                    //replaces the existing navigation state with the new one, preventing going back to the register screen
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: 'Startseite' },
                                {
                                    name: 'Anmelden', params: { image: image }
                                },
                            ],
                        })
                    );
                }, 1200);
            //register wasn't successful, show error
            } else {
                setUsernameInput("");
                setPasswordInput("");
                Alert.alert("Benutzername oder Passwort fehlerhaft.");
            }
        }

        else {
            setPasswordInput("");
            setpasswordInputRepeat("");
            Alert.alert("Passwörter stimmen nicht überein.");
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
                <View className="flex-1 justify-center items-center relative pb-60">

                    <Text className="text-3xl bottom-7 font-bold text-white">Registrieren</Text>
                    <UserCircleIcon color="white" size={170} />

                    <View className="top-28">
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
                            placeholder="Passwort wiederholen"
                            placeholderTextColor="white"
                            autoComplete="password"
                            textContentType="password"
                            className="text-white top-4 border-2 border-stone-400 rounded-md p-2 w-80 h-11"
                            style={{color: "white"}}
                            secureTextEntry={true}
                            value={passwordInputRepeat}
                            onChangeText={setpasswordInputRepeat}
                        />
                        <TouchableOpacity disabled={!isFormValid} className="top-10 bg-blue-300 rounded-md h-10 w-80"  onPress={attemptRegister}>
                            <Text className="self-center bottom-0 text-lg text-white p-1">Registrieren</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </ImageBackground>
    )
}