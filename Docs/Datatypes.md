# Datentypen

## Authentifizierungsinformationen

Ein Array mit Objekten von folgendem Format:
```
{
    username: 'Benutzername',
    passwordHash: 'Ad5dbc...D' //Base-64 des Passwort-Hashes (SHA256)
}
```
Dieses Objekt wird (als JSON-String) im AsyncStorage gespeichert.
Der Key lautet "authentificationInfo"

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
Der Kalender des Benutzer "user" befindet sich in der Collection "Terminplaner" im Dokument "calendar-user".