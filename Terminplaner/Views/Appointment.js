// Imports
import React, { useEffect } from "react";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCurrentUserContext } from '../Utils/userContext';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Switch,
  TextInput,
  Text,
  Alert,
  Image,
  Platform,
  TouchableOpacity
} from "react-native";
import { deleteEvent, addEvent } from "../Utils/Calendar";
import { padWithLeadingZero } from "../Utils/Calendar";

export const Appointment = ({ route, navigation }) => {
  const {
    newEvent: isNewEvent
  } = route.params

  //console.log("New Event?: " + isNewEvent)
  // Get the Username Value
  const {
    username: currentUser
  } = useCurrentUserContext();
  // Use State Declarations 
  const [startDate, changestartDate] = useState((isNewEvent ? undefined : route.params.oldEvent.start));
  const [endDate, changeendDate] = useState((isNewEvent ? undefined : route.params.oldEvent.end));
  const [titel, onChangeTitel] = useState((isNewEvent ? undefined : route.params.oldEvent.title));
  const [comment, onChangeComment] = useState((isNewEvent ? undefined : route.params.oldEvent.description));
  const [isEnabled, setIsEnabled] = useState((isNewEvent ? false : route.params.oldEvent.notification));
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // Use States to display the DateTimepicker Values for the StartDate/Time
  const [datePickerStartdate, setDatePickerStartdate] = useState(new Date());
  const [datePickerDateMode, setDatePickerDateMode] = useState('date');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [datePickerText, setDatePickertext] = useState(false);
  const [datePickerStartTime, setDatePickerStartTime] = useState(false);
  // Use States to display the DateTimepicker Values for the EndDate/Time
  const [datePickerEnddate, setDatePickerEnddate] = useState(new Date());
  const [datePickerDateMode2, setDatePickerDateMode2] = useState('date');
  const [datePickerShow2, setDatePickerShow2] = useState(false);
  const [datePickerEndText, setDatePickerEndText] = useState(false);
  const [datePickerEndTime, setDatePickerEndTime] = useState(false);

  // Function to set changes when using the Datepicker for the Start Date and Time
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || datePickerStartdate;
    setDatePickerShow(Platform.OS === "ios");
    setDatePickerStartdate(currentDate);
    // Set StartDate and Time in Text Areas after Formating
    let tempdate = new Date(currentDate);
    let dateStart = padWithLeadingZero(tempdate.getDate()) + '/' + (tempdate.getMonth() + 1) + '/' + tempdate.getFullYear();
    let timeStart = padWithLeadingZero(tempdate.getHours()) + ':' + padWithLeadingZero(tempdate.getMinutes()) + ' Uhr';
    setDatePickertext(dateStart)
    setDatePickerStartTime(timeStart)

    changestartDate(tempdate.toISOString())
    console.log(tempdate.toISOString())

    console.log(dateStart + ' (' + timeStart + ')')
  };
  // Show mode to set the DateTimePicker mode to Date or Time
  const showMode = (currentMode) => {
    setDatePickerShow(true);
    setDatePickerDateMode(currentMode);
  };
  // Function to set changes when using the Datepicker for the End Date and Time
  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || datePickerEnddate;
    setDatePickerShow2(Platform.OS === "ios");
    setDatePickerEnddate(currentDate);

    // Set EndDate and Time in Text Areas after Formating
    let tempdate = new Date(currentDate);
    let fDate = padWithLeadingZero(tempdate.getDate()) + '/' + (tempdate.getMonth() + 1) + '/' + tempdate.getFullYear();
    let fTime = padWithLeadingZero(tempdate.getHours()) + ':' + padWithLeadingZero(tempdate.getMinutes()) + ' Uhr';
    setDatePickerEndText(fDate)
    setDatePickerEndTime(fTime)

    changeendDate(tempdate.toISOString())

    console.log(fDate + ' (' + fTime + ')')
    console.log(selectedDate.toString())
  };
  // Show mode to set the DateTimePicker mode to Date or Time
  const showMode2 = (currentMode) => {
    setDatePickerShow2(true);
    setDatePickerDateMode2(currentMode);
  };

  //Creates a new event based on the inputs, stores it and returns it
  function eventCreation() {
    let event = {
      title: titel,
      description: (comment === undefined ? "" : comment),
      start: startDate,
      end: endDate,
      notification: isEnabled,
      notificationInfo: ""
    }
    console.log(event)
    addEvent(currentUser, event);
    return event;
  }
  
  //initialize the date/time pickers, if this is an old event
  if (!isNewEvent) {
    useEffect(() => {
      onChange(undefined, new Date(startDate));
      onChange2(undefined, new Date(endDate));
    }, [])
  }

  return (
    <SafeAreaView>
      <Text style={styles.header}>Neuer Termin</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeTitel}
        placeholder={"Titel hinzufügen"}
        value={titel}
      />
      <TextInput
        style={styles.comment}
        onChangeText={onChangeComment}
        placeholder={"Bemerkungen (optional)"}
        multiline={true}
        value={comment}
      />
      <View style={{ margin: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 0 }}>
        <Text placeholder={"Start"}>Benutzer: {currentUser}</Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 0 }}>
        <Text>Benachrichtigung?</Text>
        <Switch
          trackColor={{ false: "#AAAAAA", true: "#b5d9fc" }}
          thumbColor={isEnabled ? "dodgerblue" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 0 }} >
          <Image style={styles.tinyLogo}
            source={require('../public/images/clock.png')}></Image>
          <Text>  Von</Text>
          <Text placeholder={"Start"} style={styles.input2} title='DatePicker' onPress={() => showMode('date')} >{datePickerText}</Text>
          <Text placeholder={"Start"} style={styles.input2} title='TimePicker' onPress={() => showMode('time')} >{datePickerStartTime}</Text>
          {datePickerShow && (<DateTimePicker
            testID="dateTimePicker"
            value={datePickerStartdate}
            mode={datePickerDateMode}
            is24Hour={true}
            display='default'
            onChange={onChange}
          />)}
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 0 }}>
          <Image style={styles.tinyLogo}
            source={require('../public/images/clock.png')}></Image>
          <Text>    Bis</Text>
          <Text placeholder={"Ende"} style={styles.input2} title='DatePicker' onPress={() => showMode2('date')} >{datePickerEndText}</Text>
          <Text placeholder={"Ende"} style={styles.input2} title='TimePicker' onPress={() => showMode2('time')} >{datePickerEndTime}</Text>
          {datePickerShow2 && (<DateTimePicker
            testID="dateTimePicker2"
            value={datePickerEnddate}
            mode={datePickerDateMode2}
            is24Hour={true}
            display='default'
            onChange={onChange2}
          />)}
        </View>
      </View>
      <View className="flex-row m-2">
        <TouchableOpacity
          className="flex-auto items-center bg-dodgerblue p-2 mx-1 rounded"
          onPress={() => {
            //Don't do anything if any inputs are missing or the times selected are inconsistent
            if ((startDate === undefined) ||
              (endDate === undefined) ||
              (titel === undefined) ||
              (titel === "")) {
              Alert.alert("Angaben unvollständig",
                "Ihre Angaben sind noch unvollständig. Bitte füllen Sie alle Eingabefelder aus.");
              return;
            } else if (datePickerStartdate > datePickerEnddate) {
              Alert.alert("Angaben fehlerhaft",
                "Der Endzeitpunkt eines Ereignisses muss NACH dem Startzeitpunkt liegen.");
              return;
            }
            //Delete the old event if necessary (in case the user is editing an existing event)
            if (!isNewEvent) {
              deleteEvent(currentUser, route.params.oldEvent);
            }
            //Create the new event
            let newEvent = eventCreation();
            Alert.alert("Event erfolgreich gespeichert", "", [
              {
                text: "OK",
                onPress: () => {
                  if (isNewEvent) {
                    console.log("Created new Event")
                    navigation.goBack();
                  } else {
                    console.log("Modified Event");
                    navigation.navigate("EventDetails", { calendarItem: newEvent })
                  }
                }
              }
            ]);
          }}>
          <Text className="text-white">Speichern</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-auto items-center bg-dodgerblue p-2 mx-1 rounded"
          onPress={() => {
            console.log(titel);
            navigation.goBack();
          }}>
          <Text className="text-white">Abbrechen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10
  },
  input2: {
    height: 40,
    width: 110,
    margin: 12,
    borderWidth: 1,
    padding: 10
  },
  comment: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10
  },
  header: {
    margin: 12
  },
  flex: {
    flex: 1,
    height: 50,
    marginHorizontal: 20,
    marginTop: 5
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  flexbox: {
    flexDirection: "row",
    height: 50,
    marginHorizontal: 20,
    marginTop: 5,
    margin: 5
  },
  tinyLogo: {
    width: 50,
    height: 50,
  }
});

export default Appointment;
