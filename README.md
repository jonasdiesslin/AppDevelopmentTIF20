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

Nach der Installation und dem Setup von Expo und dem Ausführen der Befehle

> npm install

(zum installieren der Abhängigkeiten)
und

> npx expo start

kann die App mit der "Expo Go"-App ausgeführt werden.
Ebenso kann die App mit expo run:android/ios gebaut werden.

Eine APK für die Standalone-App findet sich unter: APK/app-release.apk

## Umgesetzte Features

## Must-Haves

Folgende Must-Haves wurden umgesetzt:
- Benutzer haben
    - einen Benutzernamen
    - ein Passwort
- Benutzer können
    - angelegt
    - eingeloggt
    - ausgeloggt
    - gelöscht
    werden.
- Termine können
    - angelegt
    - in einer Liste eingesehen
    - in einem Kalender eingesehen
    - bearbeitet
    - gelöscht
    werden.
- Termine haben
    - einen Titel
    - eine (optionale) Beschreibung
    - einen Startzeitpunkt
    - einen Endzeitpunkt
- Vor Terminen kann optional eine Erinnerung (15 Min vor Start) als Push-Benachrichtigung gesendet werden.\
Dabei werden immer nur die Erinnerungen für den Benutzer angezeigt, der sich als letzter angemeldet hat.

## Nice-To-Haves

Folgende Nice-To-Haves wurden umgesetzt:
- Termine werden in der Cloud (mittels Firebase/Firestore) gespeichert.
- Es existiert eine Suchfunktion für Termine.
- Termine können mit anderen Benutzern geteilt werden.

## Login-Daten

Standardmäßig vorhanden ist ein Benutzer mit dem Namen "test" und dem Passwort "test". Dieser hat auch einige voreingestellte Termine.
Weitere Benutzer können auf Wunsch über den "Registrieren"-Button auf der Startseite erstellt werden.

Um sich in die Benutzerverwaltung einloggen zu können, müssen sowohl ein Benutzername und das passende normale Passwort als auch ein spezielles Benutzerverwaltungspasswort eingegeben werden. Dieses lautet "password".
