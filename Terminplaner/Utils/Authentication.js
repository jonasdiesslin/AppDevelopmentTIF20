import * as Crypto from 'expo-crypto';
import { getAuthenticationInfo, getPasswordHash, storeAuthentificationInfo } from './Storage';

export async function authenticateUser(username, enteredPassword){
    const enteredPasswordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                               enteredPassword)
    const storedPasswordHash = await getPasswordHash(username)

    return enteredPasswordHash === storedPasswordHash;
}

export async function createUser(newUsername, newPassword){
    /*
    const passwordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,
                                                        newPassword)
    authentificationObject = {
        username: newUsername,
        passwordHash: passwordHash
    }
    authentificationInfo = getAuthenticationInfo()

    authentificationInfo.append(authentificationObject)
    storeAuthentificationInfo(authentificationInfo)
    */
    //return true for testing purposes only for now
    return true
}

export function deleteUser(username){
    return
}