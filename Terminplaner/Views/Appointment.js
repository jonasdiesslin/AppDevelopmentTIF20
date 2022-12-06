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
  Platform
} from "react-native";
import { addEvent } from "../Utils/Calendar";

export const Appointment = ({ navigation }) => {

  const {
    username: currentUser
  } = useCurrentUserContext();

  const [titel, onChangeTitel] = useState();
  const [comment, onChangeComment] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState(false);
  const [time, setTime] = useState(false);
  const [text2, setText2] = useState(false);
  const [time2, setTime2] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let tempdate = new Date(currentDate);
    let fDate = tempdate.getDate() + '/' + (tempdate.getMonth() + 1) + '/' + tempdate.getFullYear();
    let fTime = tempdate.getHours() + ':' + tempdate.getMinutes() + ' Uhr';
    setText(fDate)
    setTime(fTime)

    console.log(fDate + ' (' + fTime + ' )')
  };
  

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  function eventCreation() {
    var event = { 
          title: titel,
          description: comment,
          start: '2022-12-24T12:00:00+01:00', //start and end are ISO standard time strings
          end: '2022-12-24T14:29:00+01:00',
          notification: isEnabled
      }
    addEvent(currentUser,event);
  }

  return (
    <SafeAreaView>
      <Text style={styles.header}>Neuer Termin</Text>
      <TextInput
        style={styles.input}
        onChangeTitel={onChangeTitel}
        placeholder={"Titel hinzufügen"}
        value={titel}
      />
      <TextInput
        style={styles.comment}
        onChangeText={onChangeComment}
        placeholder={"Bemerkungen"}
        value={comment}
      />
      <View style={{margin: 12, borderWidth:1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 0 }}>
      <Image style={styles.tinyLogo}
            source={require('../public/images/clock.png')}></Image>
             <Text placeholder={"Start"}>{currentUser}</Text>
      </View>
      <View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 0 }}>
          <Text>Ganztägig?</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor={isEnabled ? "#767577" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 0 }}>
        <Text>Benachrichtigung?</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#767577" }}
          thumbColor={isEnabled ? "#767577" : "#f4f3f4"}
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
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 0 }}>
          <Image style={styles.tinyLogo}
            source={require('../public/images/clock.png')}></Image>
          <Text>    Bis</Text>
          <Text placeholder={"Ende"} style={styles.input2} title='DatePicker' onPress={() => showMode('date')} >{text2}</Text>
          <Text placeholder={"Start"} style={styles.input2} title='TimePicker' onPress={() => showMode('time')} >{time2}</Text>
        </View>
      </View>
      {show && (<DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode={mode}
        is24Hour={true}
        display='default'
        onChange={onChange}
      />)}
      <View style={{ flexDirection: "row" }}>
        <View style={styles.felx}>
          <Button title="Speichern" onPress={() => eventCreation()}>
          </Button>
        </View>
        <View style={styles.felx}>
          <Button title="Abbrechen" onPress={() => Alert.alert("abgebrochen")}>
          </Button>
        </View>
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
  felx: {
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
