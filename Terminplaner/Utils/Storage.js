//Use these constants while we don't have a local storage set up yet.
var testAuthentificationInfo = [
    {
        username: 'test',
        passwordHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' //Base-64 of SHA256('test'), i.e. the password is 'test'
    }
]
var testCalendar = [
    {
        title: 'Titel',
        description: 'Beschreibung',
        start: '2022-11-30T12:00:00Z',
        end: '2022-11-30T14:00:00Z',
        notification: true
    },
    {
        title: 'Titel2',
        description: 'Beschreibung',
        start: '2022-11-31T12:00:00Z',
        end: '2022-11-31T14:00:00Z',
        notification: true
    },
    {
        title: 'Titel3',
        description: 'Beschreibung',
        start: '2022-12-01T12:00:00Z',
        end: '2022-12-01T14:00:00Z',
        notification: true
    }
]

//Returns all of the authenticationInfo-Array
export function getAuthenticationInfo(){
    return testAuthentificationInfo
}

//Stores a new authenticationInfo-Array
export function storeAuthentificationInfo(newAuthentificationInfo){
    return testAuthentificationInfo = newAuthentificationInfo
}

export function getPasswordHash(username){
    for (let i in testAuthentificationInfo){
        if (testAuthentificationInfo[i].username == username){
            return testAuthentificationInfo[i].passwordHash
        }
    }
    //If we are here, the username has not been found
    return ""
}

export function getCalendar(username){
    return testCalendar
}

export function storeCalendar(username, newCalendar){
    testCalendar = newCalendar
}