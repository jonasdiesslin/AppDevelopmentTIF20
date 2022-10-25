import React from 'react';
import {useState} from "react";
import {  View } from 'react-native';

import SignIn from "./Views/SignIn";
import Main from "./Views/Main";

export default function App() {
  let [loggedIn, setLoggedIn] = useState(false);


  return (
       <View className="flex-1 items-center justify-center bg-white">
         {
             !loggedIn && ( <SignIn/> )
         }
         {
             loggedIn && ( <Main/> )
         }
       </View>
  );
}


