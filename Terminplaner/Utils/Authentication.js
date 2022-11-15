//Various functions for login and user management

import * as Crypto from 'expo-crypto';
import { getAuthenticationInfo, getPasswordHash, storeAuthenticationInfo } from './Storage';

export async function authenticateUser(username, enteredPassword){
    const enteredPasswordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                               enteredPassword)
    const storedPasswordHash = await getPasswordHash(username)

    return enteredPasswordHash === storedPasswordHash;
}

export async function createUser(newUsername, newPassword){
    const passwordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                        newPassword)
    let authenticationObject = {
        username: newUsername,
        passwordHash: passwordHash
    }
    let authenticationInfo = await getAuthenticationInfo()

    authenticationInfo.push(authenticationObject)
    storeAuthenticationInfo(authenticationInfo)
}

export async function deleteUser(usernameToDelete){
    const authenticationInfo = await getAuthenticationInfo();
    //Keep only users with a different username
    let newAuthenticationInfo = authenticationInfo.filter((authObj) => (authObj.username !== usernameToDelete));
    await storeAuthenticationInfo(newAuthenticationInfo);
}

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