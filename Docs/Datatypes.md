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
    notification: true/false
}
```
Aktuell werden die Kalender aller Benutzer (als JSON-Strings) im AsyncStorage gespeichert.
Der Key lautet dabei jeweils "${nutzername}-calendar", also bspw. für Benutzer "test2" "test2-calendar".