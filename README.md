# AppDevelopmentTIF20
Repository für das App-Projekt im Kurs "Entwicklung mobiler Applikationen"

Gruppe A
Antonio Brizzi
Jonas Dießlin
Simon Schneider

## Zur App

Bei dieser App handelt es sich um einen Terminkalender für mehrere Benutzer.
Sie wurde mithilfe von React Native, Expo und Nativewind (der Native-Version von Tailwind) erstellt.

## Code, Installation und Ausführung

Der Code der App befindet sich im Ordner "Terminplaner".

Nach der Installation von Expo und dem Ausführen der Befehle

> npm install

(zum installieren der Abhängigkeiten)
und

> npx expo start

kann die App mit Expo Go ausgeführt werden.

Eine APK für die Standalone-App findet sich unter:

## Must-Haves

Folgende Must-Haves wurden umgesetzt:
- Benutzer haben
    - einen Benutzernamen
    - ein Passwort
- Es können Benutzer
    - angelegt
    - eingeloggt
    - ausgeloggt
    - gelöscht
    werden
- Termine können
    - angelegt
    - in einer Liste eingesehen
    - in einem Kalender eingesehen
    - bearbeitet
    - gelöscht
    werden
- Termine haben
    - einen Titel
    - eine (optionale) Beschreibung
    - einen Startzeitpunkt
    - einen Endzeitpunkt
- Vor Terminen kann optional eine Erinnerung (15 Min vor Start) als Push-Benachrichtigung gesendet werden

## Nice-To-Haves

Folgende Nice-To-Haves wurden umgesetzt:
- Termine werden in der Cloud (mittels Firebase/Firestore) gespeichert
- Es existiert eine Suchfunktion für Termine
- Termine können mit anderen Benutzern geteilt werden

## Login-Daten

Standardmäßig vorhanden ist ein Benutzer mit dem Namen "test" und dem Passwort "test".
Weitere Benutzer können auf Wunsch über den "Registrieren"-Button auf der Startseite erstellt werden.

Um sich in die Benutzerverwaltung einloggen zu können, müssen sowohl Benutzername und normales Passwort als auch ein spezielles Benutzerverwaltungspasswort eingegeben werden. Dieses lautet "password".
