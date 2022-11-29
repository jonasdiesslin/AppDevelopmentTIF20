# Datentypen

## Authentifizierungsinformationen

Ein Array mit Objekten von folgendem Format:
```
{
    username: 'Benutzername',
    passwordHash: 'Ad5dbc...D' //Base-64 des Passwort-Hashes (SHA256)
}
```

## Kalender

Ein Kalender ist ein Array mit Objekten von folgendem Format:
```
{
    title: 'Titel',
    description: 'Beschreibung',
    start: Timestamp, //Timestamps are stored as Strings
    end: Timestamp,
    notification: true/false,
    notificationInfo: [Dependent on which notification library we'll use]
}
```
Aktuell werden die Authentifizierungsinformationen und Kalender in Firestore gespeichert.
Die Authentifizierungsinformationen befinden sich in der Collection "Terminplaner" im Dokument "authenticationInfo".
In diesem Dokument befindet sich auch das Password für die Benutzerverwaltung (ebenfalls ein SHA256-Hash),
unter userManagementInfo/passwordHash.
Der Kalender des Benutzer "user" befindet sich in der Collection "Terminplaner" im Dokument "calendar-user".