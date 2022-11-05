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
    start: Timestamp,
    end: Timestamp,
    notification: true/false
}
```
Aktuell werden die Kalender aller Benutzer in einem Objekt gespeichert. 
Dieses hat die folgende Form:
```
{
    username1: Kalender für User 1,
    username2: Kalender für User 2,
    etc.
}
```