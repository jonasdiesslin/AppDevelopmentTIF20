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


//Returns all of the authenticationInfo-Array
export function getAuthenticationInfo(){
    return testAuthentificationInfo
}

//Stores a new authenticationInfo-Array
export function storeAuthentificationInfo(newAuthentificationInfo){
    testAuthentificationInfo = newAuthentificationInfo
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
    return testCalendars[username] //NOTE: The authentication code makes sure that only valid usernames will be passed as arguments
}

export function storeCalendar(username, newCalendar){
    testCalendars[username] = newCalendar
}