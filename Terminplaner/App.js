import {useState} from "react";
import { StyleSheet, View } from 'react-native';

import SignIn from "./Views/SignIn";
import Main from "./Views/Main";

export default function App() {
  let [loggedIn, setLoggedIn] = useState(true);


  return (
       <View style={styles.container}>
         {
             !loggedIn && ( <SignIn/> )
         }
         {
             loggedIn && ( <Main/> )
         }
       </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
