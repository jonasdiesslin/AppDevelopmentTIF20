import React from 'react';
import {useState} from "react";
import {  View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import SignIn from "./Views/SignIn";
import Main from "./Views/Main";

export default function App() {
  let [loggedIn, setLoggedIn] = useState(false); //Boolean. Stores if there is currently a user logged into the app.
  let [currentUser, setCurrentUser] = useState(null); //The username of the currently active user

  return (
      <NavigationContainer>
        <View className="flex-1 items-center justify-center bg-white">
         {
             !loggedIn && ( <SignIn loginFunction={setLoggedIn} userFunction={setCurrentUser}/> )
         }
         {
             loggedIn && ( <Main loginFunction={setLoggedIn} userFunction={setCurrentUser} username={currentUser}/> )
         }
       </View>
      </NavigationContainer>
  );
}


