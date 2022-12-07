import React from "react";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCurrentUserContext } from '../Utils/userContext';
import { Event } from "../Components/Event";
import {
  View,
  Button,
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
import { addEvent } from "../Utils/Calendar";

import { padWithLeadingZero } from "../Utils/Calendar";

export const Appointment = ({ navigation }) => {

  const {
    username: currentUser
  } = useCurrentUserContext();

  const [startDate, changestartDate] = useState();
  const [endDate, changeendDate] = useState();
  const [titel, onChangeTitel] = useState();
  const [comment, onChangeComment] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState(false);
  const [time, setTime] = useState(false);
  const [date2, setDate2] = useState(new Date());
  const [mode2, setMode2] = useState('date');
  const [show2, setShow2] = useState(false);
  const [text2, setText2] = useState(false);
  const [time2, setTime2] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let tempdate = new Date(currentDate);
    let fDate = padWithLeadingZero(tempdate.getDate()) + '/' + (tempdate.getMonth() + 1) + '/' + tempdate.getFullYear();
    let fTime = padWithLeadingZero(tempdate.getHours()) + ':' + padWithLeadingZero(tempdate.getMinutes()) + ' Uhr';
    setText(fDate)
    setTime(fTime)

    changestartDate(tempdate.toISOString())
    console.log(tempdate.toISOString())

    console.log(fDate + ' (' + fTime + ')')
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date2;
    setShow2(Platform.OS === "ios");
    setDate2(currentDate);

    let tempdate = new Date(currentDate);
    let fDate = padWithLeadingZero(tempdate.getDate()) + '/' + (tempdate.getMonth() + 1) + '/' + tempdate.getFullYear();
    let fTime = padWithLeadingZero(tempdate.getHours()) + ':' + padWithLeadingZero(tempdate.getMinutes()) + ' Uhr';
    setText2(fDate)
    setTime2(fTime)

    changeendDate(tempdate.toISOString())

    console.log(fDate + ' (' + fTime + ')')
    console.log(selectedDate.toString())
  };

  const showMode2 = (currentMode) => {
    setShow2(true);
    setMode2(currentMode);
  };

  function eventCreation() {
    let event = {
      title: titel,
      description: comment,
      start: startDate,
      end: endDate,
      notification: isEnabled,
      notificationInfo: ""
    }
    console.log(event)
    addEvent(currentUser, event);
  }

  function clearAll(){

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
          <Text placeholder={"Start"} style={styles.input2} title='DatePicker' onPress={() => showMode('date')} >{text}</Text>
          <Text placeholder={"Start"} style={styles.input2} title='TimePicker' onPress={() => showMode('time')} >{time}</Text>
          {show && (<DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display='default'
            onChange={onChange}
          />)}
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 0 }}>
          <Image style={styles.tinyLogo}
            source={require('../public/images/clock.png')}></Image>
          <Text>    Bis</Text>
          <Text placeholder={"Ende"} style={styles.input2} title='DatePicker' onPress={() => showMode2('date')} >{text2}</Text>
          <Text placeholder={"Ende"} style={styles.input2} title='TimePicker' onPress={() => showMode2('time')} >{time2}</Text>
          {show2 && (<DateTimePicker
            testID="dateTimePicker2"
            value={date2}
            mode={mode2}
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
              if (  (startDate === undefined) ||
                    (endDate === undefined) ||
                    (titel === undefined) ||
                    (titel === "")){
                  Alert.alert("Angaben unvollständig",
                    "Ihre Angaben sind noch unvollständig. Bitte füllen Sie alle Eingabefelder aus.");
                    return;
              }
              eventCreation();
              Alert.alert("Event erfolgreich gespeichert", "", [
                {
                  text: "OK",
                  onPress: () => {
                    navigation.goBack();
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
    width: 100,
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
