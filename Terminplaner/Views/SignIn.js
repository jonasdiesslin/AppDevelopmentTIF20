import {View,Text, Button, TextInput, SafeAreaView, Alert} from "react-native";

export default function SignIn() {
    return (
        <View className="relative">
            <View  className="justify-center absolute top-20"><Text className="absolute">Terminplaner-Login</Text></View >

            <SafeAreaView>
            <TextInput
                placeholder="Benutzername"
                onChangeText={text => (text)}
            />
            <TextInput
                placeholder="Passwort"
                onChangeText={text => (text)}
                keyboardType="numeric"
            />
        </SafeAreaView>
            <Button title="Login" onPress={() => Alert.alert("Button pressed")} />
        </View>
    )
}
