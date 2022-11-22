import React, {useEffect, useState} from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Initial from "./Views/Initial/Initial";
import SignIn from "./Views/Initial/SignIn";
import Register from "./Views/Initial/Register";
import Main from "./Views/Main";
import Appointment from "./Views/Appointment";
import CalendarView from './Views/CalendarView';
import EventDetails from './Views/EventDetails';
import DayView from './Views/DayView';

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
  }, []) //Empty dependencies -> Effect used only one

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
                                             // color: "white",
                                           },
                                           // headerTitle: '',
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
                        <Stack.Navigator initialRouteName="Main">
                          <Stack.Screen name="Main" component={Main} options={{ title:"Übersicht" }}/>
                          <Stack.Screen name="Appointment" component={Appointment} options={{ title:"Neuer Termin" }}/>
                          <Stack.Screen name="CalendarView" component={CalendarView} options={{ title:"Kalenderansicht" }}/>
                          <Stack.Screen name="DayView" component={DayView} options={{ title:"Tagesansicht" }}/>
                          <Stack.Screen name="EventDetails" component={EventDetails} options={{ title: "Termindetails"}}/>
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

