import { Text, View} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {UserCircleIcon} from "react-native-heroicons/outline";
import React, { useState } from "react";

export default function User ({ title }){

    return (
        <View className="flex-auto flex-row justify-center top-24 mx-1 my-2 p-3 bg-transparent border-2 border-stone-400 rounded-md">
            
            <BouncyCheckbox
                size={35}
                onPress={(isPressed) => {
                    console.log("Checkbox pressed: " + isPressed)
                }}
            />
            <Text className="self-center text-2xl text-white text-center">{title} </Text>

            <View className="justify-self-end left-10"><UserCircleIcon color="white" size={50} /></View>
                    
        </View>
    )
}