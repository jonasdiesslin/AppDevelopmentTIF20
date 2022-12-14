//Various functions for login and user management

import * as Crypto from 'expo-crypto';
import { getAuthenticationInfo, getPasswordHash, storeAuthenticationInfo, initializeCalendar, getManagementInfo, deleteCalendar } from './Storage';

//Takes a (username, password)-pair
//Returns true if password correct and false if not
export async function authenticateUser(username, enteredPassword){
    const enteredPasswordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                               enteredPassword);
    const storedPasswordHash = await getPasswordHash(username);
    return enteredPasswordHash === storedPasswordHash;
}

//Creates a new user entry in the authenticationInfo document 
export async function createUser(newUsername, newPassword){
    const passwordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                        newPassword);
    //First, check if a user with this name already exists
    let authenticationInfo = await getAuthenticationInfo();
    if (authenticationInfo.filter((authObj) => (authObj.username === newUsername)).length > 0){
        return false;
    }
    //username not in use yet -> we can create a new user
    let authenticationObject = {
        username: newUsername,
        passwordHash: passwordHash
    };

    authenticationInfo.push(authenticationObject);
    storeAuthenticationInfo(authenticationInfo);
    initializeCalendar(newUsername);

    return true;
}

//Removes a user from authenticationInfo
export async function deleteUser(usernameToDelete){
    const authenticationInfo = await getAuthenticationInfo();
    //Keep only users with a different username
    let newAuthenticationInfo = authenticationInfo.filter((authObj) => (authObj.username !== usernameToDelete));
    await storeAuthenticationInfo(newAuthenticationInfo);
    
    deleteCalendar(usernameToDelete);

    return true;
}

//Check if we already have a user with the given name.
//Used to avoid duplicate usernames.
export async function checkIfUsernameExists(usernameToFind){
    const authenticationInfo = await getAuthenticationInfo();
    for (const i in authenticationInfo){
        if (authenticationInfo[i].username == usernameToFind){

            return true
        }
    }
    //If we're here, the username wasn't found in the authenticationInfo-array -> it doesn't exist yet
    return false;
}

//Authenticate a user for the user management screen
export async function authenticateManager(enteredUsername, enteredPassword, enteredManagementPassword){
    const managementInfo = await getManagementInfo();
    const enteredManagementPasswordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                                enteredManagementPassword); 
    const userAuthenticated = await authenticateUser(enteredUsername, enteredPassword);
    
    if(userAuthenticated &&
        enteredManagementPasswordHash === managementInfo.passwordHash){
        return true;
    } else {
        return false;
    }
}