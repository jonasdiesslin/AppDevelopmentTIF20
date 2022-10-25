import * as Crypto from 'expo-crypto';
import { getAuthenticationInfo, getPasswordHash, storeAuthentificationInfo } from './Storage';

export async function authenticateUser(username, enteredPassword){
    const enteredPasswordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                               enteredPassword)
    const storedPasswordHash = getPasswordHash(username)

    if(enteredPasswordHash == storedPasswordHash){
        return true
    } else {
        return false
    }
}

export async function createUser(newUsername, newPassword){
    const passwordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                        newPassword)
    authentificationObject = {
        'username': newUsername,
        'passwordHash': passwordHash
    }
    authentificationInfo = getAuthenticationInfo()

    //Check if a user with this name exists already, abort if yes
    usernameIndex = authentificationInfo.findIndex(element => (element.username == newUsername))
    if (usernameIndex != -1) {
        return false
    }

    authentificationInfo.append(authentificationObject)
    storeAuthentificationInfo(authentificationInfo)

    return true
}

export function deleteUser(username){

}