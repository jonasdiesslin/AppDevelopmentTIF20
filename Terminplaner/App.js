import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, TouchableOpacity, Text, Alert } from 'react-native';
import { ArrowLeftOnRectangleIcon } from 'react-native-heroicons/outline';

import Initial from "./Views/Initial/Initial";
import SignIn from "./Views/Initial/SignIn";
import Register from "./Views/Initial/Register";
import UserChoiceAuth from "./Views/Initial/UserChoiceAuth";
import UserChoice from "./Views/Initial/UserChoice";
import Main from "./Views/Main";
import Appointment from "./Views/Appointment";
import CalendarView from './Views/CalendarView';
import EventDetails from './Views/EventDetails';
import DayView from './Views/DayView';
import Search from './Views/Search';

import { currentUserContext } from './Utils/userContext';
//import { initLocalStorage } from './Utils/Storage'
import { initializeFirebaseStorage } from './Utils/Storage';

const background = require("./public/images/bg.jpg")

//Set up the global navigator here
const Stack = createNativeStackNavigator();

export default function App() {
  let [loggedIn, setLoggedIn] = useState(false); //Boolean. Stores if there is currently a user logged into the app.
  let [currentUser, setCurrentUser] = useState(null); //The username of the currently active user. Null if no user logged in currently.

  //Initialize storage once at startup, if necessary
  useEffect(() => {
    initializeFirebaseStorage();
  }, []) //Empty dependencies -> Effect used only once

  return (
      <NavigationContainer>
        <currentUserContext.Provider value={{
          loginFunction: setLoggedIn,
          username: currentUser,
          userFunction: setCurrentUser,
          background: background
        }}>
        {
          !loggedIn &&  (
                        <Stack.Navigator initialRouteName="Initial"
                                         screenOptions={{
                                           headerTitleStyle: {
                                              //color: "white",
                                           },
                                             headerTitle: '',
                                             headerTransparent: true,
                                             headerTintColor: "#fff"
                                         }}
                        >
                            <Stack.Screen name="Startseite" component={Initial}/>
                            <Stack.Screen name="Anmelden" component={SignIn}/>
                            <Stack.Screen name="Registrieren" component={Register}/>
                            <Stack.Screen name="BenutzerauswahlAuth" component={UserChoiceAuth}/>
                            <Stack.Screen name="Benutzerauswahl" component={UserChoice}/>
                        </Stack.Navigator>
                        )
        }
        {
          loggedIn && ( 
                        <Stack.Navigator 
                          initialRouteName="Main"
                          screenOptions={{ gestureEnabled: false }}
                        >
                          <Stack.Screen
                            name="Main" component={Main}
                            options={{ 
                              title:"Übersicht",
                              //Make a logout button in this screen's header
                              headerRight: () => (
                                <TouchableOpacity onPress={() => {
                                  setCurrentUser(null);
                                  setLoggedIn(false);//Now we'll go back to the login component
                                }}>
                                  <ArrowLeftOnRectangleIcon size="30" color="dodgerblue"/>
                                </TouchableOpacity>
                              )
                            }}/>
                          <Stack.Screen name="Appointment" component={Appointment} options={{ title:"Neuer Termin" }}/>
                          <Stack.Screen name="CalendarView" component={CalendarView} options={{ title:"Kalenderansicht" }}/>
                          <Stack.Screen name="DayView" component={DayView} options={{ 
                            title: "Tagesansicht",
                            headerLeft: () => (
                              <HeaderBackButton onPress={() => {Alert.alert("Klick.")}}/>
                            )
                          }}/>
                          <Stack.Screen name="EventDetails" component={EventDetails} options={{ title: "Termindetails"}}/>
                          <Stack.Screen name="Search" component={Search} options={{ title: "Suche" }}/>
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

