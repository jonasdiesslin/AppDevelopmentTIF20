import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {  Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function setupNotificationsForUser(){

}

export async function scheduleTestPushNotification() {
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

export async function scheduleEventNotification(event, username){
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
  
    /*
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
    */
}

export async function cancelNotification(notifId){
    await Notifications.cancelScheduledNotificationAsync(notifId);
}
  
