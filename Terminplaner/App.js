import React, {useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Alert } from 'react-native';
import { ArrowLeftOnRectangleIcon } from 'react-native-heroicons/outline';
import { registerForPushNotificationsAsync } from "./Utils/Notifications";

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
import { initializeFirebaseStorage } from './Utils/Storage';
import ShareEvent from './Views/ShareEvent';

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

  //Set up notification handling
  useEffect(() => {
    registerForPushNotificationsAsync()

    return () => {};
  }, []);

  //Now return the actual app body

  return (
      <NavigationContainer>
        <currentUserContext.Provider value={{
          //Provide global context for login/logout, current user, and a nice background image
          loginFunction: setLoggedIn,
          username: currentUser,
          userFunction: setCurrentUser,
          background: background
        }}>
          <Stack.Navigator initialRouteName="Startseite"
                          screenOptions={{
                            headerTransparent: (!loggedIn ? true : false),
                            headerTintColor: (!loggedIn ? "#fff" : "#000"),
                            gestureEnabled: false
                          }}
                        >
                          <Stack.Screen name="Startseite" component={Initial} options={{ title: "" }}/>
                          <Stack.Screen name="Anmelden" component={SignIn} options={{ title: "" }}/>
                          <Stack.Screen name="Registrieren" component={Register} options={{ title: "" }}/>
                          <Stack.Screen name="BenutzerauswahlAuth" component={UserChoiceAuth} options={{ title: "" }}/>
                          <Stack.Screen name="Benutzerauswahl" component={UserChoice} options={{ title: "" }}/>

                          <Stack.Screen
                            name="Main" component={Main}
                            options={{ 
                              title:"??bersicht",
                              //Disable back button in this screen so the user is forced to click the logout button
                              headerBackVisible: false,
                              //Make a temporary logout button in this screen's header so the user doesn't see any flickering
                              headerRight: () => (
                                <TouchableOpacity onPress={() => {
                                  Alert.alert("Klick");
                                }}>
                                  <ArrowLeftOnRectangleIcon size="30" color="dodgerblue"/>
                                </TouchableOpacity>
                              )
                            }}/>
                          <Stack.Screen name="Appointment" component={Appointment} options={{ title:"Neuer Termin" }}/>
                          <Stack.Screen name="CalendarView" component={CalendarView} options={{ title:"Kalenderansicht" }}/>
                          <Stack.Screen name="DayView" component={DayView} options={{ 
                            title: "Tagesansicht",
                            //This button is only a placeholder. 
                            //Immediately after loading DayView, it is replaced with a custom back button.
                            //We only use it so the user doesn't see any flickering.
                            headerLeft: () => (
                              <HeaderBackButton onPress={() => {Alert.alert("Klick.")}}/>
                            )
                          }}/>
                          <Stack.Screen name="EventDetails" component={EventDetails} options={{ title: "Termindetails"}}/>
                          <Stack.Screen name="Search" component={Search} options={{ title: "Suche" }}/>
                          <Stack.Screen name="ShareEvent" component={ShareEvent} options={{ title: "Termin teilen"}}/>
                        </Stack.Navigator>
        </currentUserContext.Provider>
      </NavigationContainer>
  );
}

