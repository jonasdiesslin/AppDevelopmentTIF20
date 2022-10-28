# Datentypen

## Authentifizierungsinformationen

Ein Array mit Objekten von folgendem Format:
```
{
    username: 'Benutzername',
    passwordHash: 'Ad5dbc...D' //Base-64 des Passwort-Hashes
}
```

## Kalender

Ein Array mit Objekten von folgendem Format:
```
{
    title: 'Titel',
    description: 'Beschreibung'
    start: Timestamp,
    end: Timestamp,
    notification: true/false
}
```