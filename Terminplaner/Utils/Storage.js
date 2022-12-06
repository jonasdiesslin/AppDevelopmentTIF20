import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, setDoc, onSnapshot } from "firebase/firestore";

//Global variables to hold authenticationInfo and calendars
let authenticationInfo = [];
let managementInfo = {};
//let calendars = {};

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
const db = getFirestore(app);

export async function initializeFirebaseStorage(){
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
    setDoc(doc(db, "Terminplaner", "authenticationInfo"), {
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
    //If we are here, the username has not been found
    return ""
}

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

export async function storeCalendar(username, newCalendar){
    setDoc(doc(db, "Terminplaner", `calendar-${username}`), {
        calendarArray: newCalendar
    });
}

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

export async function getManagementInfo(){
    return managementInfo;
}