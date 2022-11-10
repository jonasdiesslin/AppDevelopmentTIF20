import React from 'react';
import {useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Initial from "./Views/Initial/Initial";
import SignIn from "./Views/Initial/SignIn";
import Register from "./Views/Initial/Register";
import Main from "./Views/Main";
import Appointment from "./Views/Appointment";

import { currentUserContext } from './Utils/userContext';

//Set up the global navigator here
const Stack = createNativeStackNavigator();

export default function App() {
  let [loggedIn, setLoggedIn] = useState(false); //Boolean. Stores if there is currently a user logged into the app.
  let [currentUser, setCurrentUser] = useState(null); //The username of the currently active user. Null if no user logged in currently.

  return (
      <NavigationContainer>
        <currentUserContext.Provider value={{
          loginFunction: setLoggedIn,
          username: currentUser,
          userFunction: setCurrentUser
        }}>
        {
          !loggedIn &&  (
                        <Stack.Navigator initialRouteName="Initial"
                                         screenOptions={{
                                             headerTransparent: true,
                                         }}
                        >
                            <Stack.Screen name="Startseite" component={Initial}/>
                            <Stack.Screen name="Anmelden" component={SignIn}/>
                            <Stack.Screen name="Registrieren" component={Register}/>
                            <Stack.Screen name="Benutzerauswahl" component={Register}/>
                        </Stack.Navigator>
                        )
        }
        {
          loggedIn && ( 
                        <Stack.Navigator initialRouteName="Appointment">
                          <Stack.Screen name="Main" component={Main} options={{ title:"Übersicht" }}/>
                          <Stack.Screen name="Appointment" component={Appointment} options={{ title:"Test" }}/>
                        </Stack.Navigator>
                      )
        }  
        </currentUserContext.Provider>
      </NavigationContainer>
  );
}


/*
<View className="flex-1 items-center justify-center bg-white">
  {
    !loggedIn && ( <SignIn loginFunction={setLoggedIn} userFunction={setCurrentUser}/> )
  }
  {
    loggedIn && ( <Main loginFunction={setLoggedIn} userFunction={setCurrentUser} username={currentUser}/> )
  }
</View>
*/

