//Various functions for dealing with storage

import AsyncStorage from '@react-native-async-storage/async-storage';

//Use these constants while we don't have a local storage set up yet.
var testAuthentificationInfo = [
    {
        username: 'test',
        passwordHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' //Base-64 of SHA256('test'), i.e. the password is 'test'
    },
    {
        username: 'test2',
        passwordHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' //Base-64 of SHA256('test'), i.e. the password is 'test'
    }
]

var testCalendars = {
    test: [
        {
            title: 'Titel',
            description: 'Beschreibung',
            start: '2022-11-29T12:00:00+01:00', //start and end are ISO standard time strings
            end: '2022-11-29T14:29:00+01:00',
            notification: true
        },
        {
            title: 'Titel2',
            description: 'Beschreibung',
            start: '2022-11-30T12:00:00+01:00',
            end: '2022-11-30T14:00:00+01:00',
            notification: true
        },
        {
            title: 'Titel3',
            description: 'Beschreibung',
            start: '2022-12-01T12:00:00+01:00',
            end: '2022-12-01T14:00:00+01:00',
            notification: true
        }
    ],
    test2: [
        {
            title: 'Titel',
            description: 'Beschreibung',
            start: '2022-11-29T12:00:00+01:00', //start and end are ISO standard time strings
            end: '2022-11-29T14:29:00+01:00',
            notification: true
        }
    ]
}

//Checks if the local storage is empty and initializes it with example data, if necessary
//Returns true if storage was empty (and had to be initialized) and false if some data was already stored.
export async function initLocalStorage(){
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length == 0){
        //Local storage empty, set up example data
        //First the authentication info
        await AsyncStorage.setItem("authenticationInfo", JSON.stringify(testAuthentificationInfo));
        //Then the individual calendars
        for (const currentUsername in testCalendars){
            await AsyncStorage.setItem((currentUsername + "-calendar"), JSON.stringify(testCalendars[currentUsername]));
        }
        return true;
    } else {
        //Something is stored in localStorage already -> nothing to do for us
        return false;
    }
}


//Returns all of the authenticationInfo-Array
export async function getAuthenticationInfo(){
    const jsonValue = await AsyncStorage.getItem("authenticationInfo");
    const authenticationInfo = JSON.parse(jsonValue);
    return authenticationInfo;
}

//Stores a new authenticationInfo-Array
export async function storeAuthenticationInfo(newAuthenticationInfo){
    await AsyncStorage.setItem("authenticationInfo", JSON.stringify(newAuthenticationInfo))
}

//Returns the password hash associated with a given username (or the empty string if the username doesn't exist)
export async function getPasswordHash(username){
    const authentificationInfo = await getAuthenticationInfo()
    for (const i in authentificationInfo){
        if (authentificationInfo[i].username == username){
            return authentificationInfo[i].passwordHash
        }
    }
    //If we are here, the username has not been found
    return ""
}

export async function getCalendar(username){
    const jsonValue = await AsyncStorage.getItem(username + "-calendar");
    const calendar = JSON.parse(jsonValue);
    return calendar //NOTE: The authentication code makes sure that only valid usernames will be passed as arguments
}

export async function storeCalendar(username, newCalendar){
    await AsyncStorage.setItem((username + "-calendar"), JSON.stringify(newCalendar));
}