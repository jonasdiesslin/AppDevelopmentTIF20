import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from "react-native";

import { getCalendar } from "./Storage";

//This file contains basic notification handling code.
//Notifications are handled on a local basis, with all currently scheduled notifications stored in AsyncStorage.

//Perform some basic initialization (configure how this app should handle notifications)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

//Reschedule notifications for a given user, i.e. cancel all existing notifications and schedule all of this users notifications
export async function rescheduleNotificationsForUser(username){
  await cancelCurrentNotifications();
  await scheduleNotificationsForUser(username);

  return;
}

//Schedule all Notifications for the user currently logged in
async function scheduleNotificationsForUser(username){
  const userCalendar = await getCalendar(username);
  //Store new Ids in this array so we can do a batch update at the end
  let newNotificationIdArray = [];

  for (const calendarItem of userCalendar){
    if(calendarItem.notification){
      //We'll take care of updating AsyncStorage ourselves so scheduleNotificationInternal doesn't have to
      let newId = await scheduleEventNotificationInternal(calendarItem, username, false);
      newNotificationIdArray.push(newId);
    }
  }

  //Batch update AsyncStorage with the notification Ids (for performance reasons)
  await AsyncStorage.setItem("scheduledNotifications", JSON.stringify(newNotificationIdArray));

  console.log(newNotificationIdArray);
  console.log(`Scheduled ${newNotificationIdArray.length} notifications.`);
}

//Cancel all notifications currently scheduled on this device
async function cancelCurrentNotifications(){
  //Get all notification Ids and cancel them one by one
  let notificationIdArray = JSON.parse(await AsyncStorage.getItem("scheduledNotifications"));

  if (notificationIdArray != null){
    for (const notificationId of notificationIdArray){
      //We can batch delete the Ids when we're done, so cancelNotificationInternal doesn't have to
      await cancelNotificationInternal(notificationId, false);
    }
    console.log(`Cancelled ${notificationIdArray.length} notifications.`);
  } else {
    console.log("scheduledNotifications was not initialized");
  }

  //Store our changes
  await AsyncStorage.setItem("scheduledNotifications", JSON.stringify([]));
}

//A simple test function to check if notifications are working
async function scheduleTestPushNotification() {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: {},
      },
      trigger: { seconds: 2 },
    });
    return id;
}

//Schedule a notification for a given event and a given user.
export async function scheduleEventNotification(event, username){
  const id = await scheduleEventNotificationInternal(event, username, true);
  return id;
}

//Schedule a notification for a given event and a given user.
//Optionally stores the new notifications Id as well.
async function scheduleEventNotificationInternal(event, username, storeId){
  //Takes in a number and pads with a leading zero if less than ten. Use for displaying minutes.
  function padWithLeadingZero(input){
    if(input < 10)
        return "0" + input.toString()
    else
        return input.toString()
  }

  const startDate = new Date(event.start);
  //15 min before the start of the event
  const notificationDate = new Date(startDate.getTime() - 15*60*1000);

  const timeString = `${startDate.getHours()}:${padWithLeadingZero(startDate.getMinutes())}`;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Anstehender Termin: ${event.title}`,
      body: `Beginnt um ${timeString}`,
      data: {
        event: event,
        username: username
      },
    },
    trigger: notificationDate,
  });

  console.log("Scheduled notification for " + notificationDate.toISOString() + ".");

  if(storeId){
    let notificationIdArrayJSON = await AsyncStorage.getItem("scheduledNotifications");
    let newNotificationIdArray = JSON.parse(notificationIdArrayJSON);
    newNotificationIdArray.push(id);
    await AsyncStorage.setItem("scheduledNotifications", JSON.stringify(newNotificationIdArray));
  }

  return id;
}

export async function registerForPushNotificationsAsync() {
    //let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Fehlende Berechtigung', "Diese App benötigt für ihr Funktionieren die Berechtigung zum Versenden von Benachrichtigungen.");
        return;
      }

      //NOTE: We do local notifications only, i.e. we don't need any push tokens
      /*
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      */

    } else {
      Alert.alert('Emulator erkannt', "Verwenden Sie diese App bitte auf einem physischen Gerät, " +
        "um Benachrichtigungen korrekt zu empfangen.");
    }
  
    //return token;
    return;
}

//Cancel a notification given it's Id.
export async function cancelNotification(notifId){
  await cancelNotificationInternal(notifId, true);
}

//Cancel a notification given it's Id. Optionally deletes it's Id from AsyncStorage as well.
async function cancelNotificationInternal(notifId, deleteId){
    await Notifications.cancelScheduledNotificationAsync(notifId);

    if(deleteId){
      let notificationIdArrayJSON = await AsyncStorage.getItem("scheduledNotifications");
      let newNotificationIdArray = JSON.parse(notificationIdArrayJSON);
      //Keep the other Ids in the array, but remove notifId
      newNotificationIdArray = newNotificationIdArray.filter((id) => (id !== notifId));
      await AsyncStorage.setItem("scheduledNotifications", JSON.stringify(newNotificationIdArray));
    }
}
  
