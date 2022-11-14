//Various functions for login and user management

import * as Crypto from 'expo-crypto';
import { getAuthenticationInfo, getPasswordHash, storeAuthentificationInfo } from './Storage';

export async function authenticateUser(username, enteredPassword){
    const enteredPasswordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                               enteredPassword)
    const storedPasswordHash = await getPasswordHash(username)

    return enteredPasswordHash === storedPasswordHash;
}

export async function createUser(newUsername, newPassword){
    const passwordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                        newPassword)
    authentificationObject = {
        username: newUsername,
        passwordHash: passwordHash
    }
    authentificationInfo = getAuthenticationInfo()

    authentificationInfo.append(authentificationObject)
    storeAuthentificationInfo(authentificationInfo)
}

export async function deleteUser(usernameToDelete){
    const authenticationInfo = await getAuthenticationInfo();
    //Keep only users with a different username
    let newAuthentificationInfo = authenticationInfo.filter((authObj) => (authObj.username !== usernameToDelete));
    await storeAuthentificationInfo(newAuthentificationInfo);
}

export async function checkIfUsernameExists(usernameToFind){
    const authenticationInfo = await getAuthenticationInfo();
    for (const i in authentificationInfo){
        if (authentificationInfo[i].username == usernameToFind){
            return true
        }
    }
    //If we're here, the username wasn't found in the authenticationInfo-array -> it doesn't exist yet
    return false;
}