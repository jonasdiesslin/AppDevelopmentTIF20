import { initializeApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDoc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { Alert } from 'react-native';

//This file contains basic storage handling code.
//See Docs/Datatypes.md for more info.

//Global variables to hold authenticationInfo and managementInfo
let authenticationInfo = [];
let managementInfo = {};

//For efficiency reasons, we keep only a single active calendar in memory at a time (there's only one user logged in at any time as well).
let currentCalendar = [];
let currentCalendarUsername = ""; //Stores which users calendar is currently stored in currentCalendar
let unsubCurrentCalendar = () => {}; //Initially, we are not subscribed to anything, so unsub has no work to do.

//Set up Firebase connection
const firebaseConfig = {
    apiKey: "AIzaSyDtoXY_PF4N9T_gjaahc_WizlmGtdbHacA",
    authDomain: "terminplaner-f5a14.firebaseapp.com",
    projectId: "terminplaner-f5a14",
    storageBucket: "terminplaner-f5a14.appspot.com",
    messagingSenderId: "404188597929",
    appId: "1:404188597929:web:66b87373d424ec6deaa3b8"
};

const app = initializeApp(firebaseConfig);
//NOTE: getFirestore gets a timeout when run in the standalone app.
//I haven no idea why this is the case. Keep this version for now.
//const db = getFirestore(app);
const db = initializeFirestore(app, {experimentalForceLongPolling: true});

export async function initializeFirebaseStorage(){
    //Wait for the authentication info to be loaded
    console.log("InitializeFirebaseStorage called.")
    try {
        const docRef = doc(db, "Terminplaner", "authenticationInfo");
        const docSnap = await getDoc(docRef);
    } catch (error) {
        //Inform the user something went wrong
        console.log(error);
        Alert.alert("Netzwerk-Fehler",
            "Laden der Authentifizierungsinformationen aus Firestore fehlgeschlagen. " +
            "Bitte überprüfen Sie ihre Netzwerkverbindung und -einstellungen und starten Sie die App neu.")
        return;
    }

    //Set up listener for authenticationInfo
    const unsubAuthenticationInfo = onSnapshot(doc(db, "Terminplaner", "authenticationInfo"), (doc) => {
        authenticationInfo = doc.data().authenticationInfoArray;
        managementInfo = doc.data().userManagementInfo;
    });
}

//Returns all of the authenticationInfo-Array
export async function getAuthenticationInfo(){
    return authenticationInfo;
}

//Stores a new authenticationInfo-Array
export async function storeAuthenticationInfo(newAuthenticationInfo){
    //NOTE: We really *have to* await the set operation here. Otherwise, multiple closely spaced deletes
    //(e.g. when deleting multiple users at once) will lead to concurrency issues
    //This could be mitigated by handling bulk deletes in Authentication.js (which would also save traffic)
    await setDoc(doc(db, "Terminplaner", "authenticationInfo"), {
        authenticationInfoArray: newAuthenticationInfo,
        //Store the managementInfo as well, otherwise it'll get deleted from the document
        userManagementInfo: managementInfo
    });
}

//Returns the password hash associated with a given username (or the empty string if the username doesn't exist)
export async function getPasswordHash(username){
    const authentificationInfo = await getAuthenticationInfo()
    for (const i in authentificationInfo){
        if (authentificationInfo[i].username == username){
            return authentificationInfo[i].passwordHash;
        }
    }
    //If we are here, the username has not been found.
    //Return an empty string, as this will never equal any SHA-256 digest (so authentication will always fail)
    return ""
}

//Get the (complete) calendar for a given user
export async function getCalendar(username){
    if (currentCalendarUsername === username) {
        //We already have the correct calendar stored locally
        return currentCalendar;
    } else {
        //We need to load a different calendar
        unsubCurrentCalendar();
        
        //Wait for the correct calendar to be loaded
        const docRef = doc(db, "Terminplaner", `calendar-${username}`);
        const docSnap = await getDoc(docRef);
        currentCalendar = docSnap.data().calendarArray;

        //Set up a snapshot listener for this calendar (not sure if this is necessary)
        const newUnsub = onSnapshot(doc(db, "Terminplaner", `calendar-${username}`), (doc) => {
            currentCalendar = doc.data().calendarArray;
        });

        //Update unsubscriber and username for the current calender
        unsubCurrentCalendar = newUnsub;
        currentCalendarUsername = username;

        //And return what we've got
        return currentCalendar;
    }
}

//Store a new calendar for a given user
export async function storeCalendar(username, newCalendar){
    await setDoc(doc(db, "Terminplaner", `calendar-${username}`), {
        calendarArray: newCalendar
    });
}

//Set up a new calendar for given username
//Used after creating a new user
export async function initializeCalendar(username){
    //First, create a new calendar document for this user
    await setDoc(doc(db, "Terminplaner", `calendar-${username}`), {
        calendarArray: []
    });

    //And switch over to the new calendar
    unsubCurrentCalendar();
    const newUnsub = onSnapshot(doc(db, "Terminplaner", `calendar-${username}`), (doc) => {
        currentCalendar = doc.data().calendarArray;
    });
    unsubCurrentCalendar = newUnsub;
    currentCalendarUsername = username;
}

//Delete calendar for a given username
//Used when deleting a user
export async function deleteCalendar(username){
    //Unsub first so we don't get any spurious snapshot
    unsubCurrentCalendar();
    currentCalendarUsername = "";
    deleteDoc(doc(db, "Terminplaner", `calendar-${username}`));
    return;
}

//Return the managementInfo
//Used for authenticating users for the user management functionality
export async function getManagementInfo(){
    return managementInfo;
}