import React from "react";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Button,
  SafeAreaView,
  StyleSheet,
  Switch,
  TextInput,
  Text,
  Alert,
  Platform
} from "react-native";

export const Appointment = ({ navigation }) => {
  const [titel, onChangeTitel] = useState();
  const [comment, onChangeComment] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState(false);
  const [time, setTime] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    
    let tempdate = new Date(currentDate);
    let fDate = tempdate.getDate() + '/' + (tempdate.getMonth() + 1) + '/' + tempdate.getFullYear();
    let fTime = tempdate.getHours() + ':' + tempdate.getMinutes() + 'Uhr';
    setText(fDate + '\n' + fTime)
    setTime(fTime)

    console.log(fDate + ' (' + fTime + ' )')
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

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
      <View style={styles.flexbox}>
        <Switch
          trackColor={{ false: "#767577", true: "#767577" }}
          thumbColor={isEnabled ? "#767577" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text>Ganztägig?</Text>
      </View>
      <View>
      <Text style={styles.input} title='DatePicker' onPress={() => showMode('date') } >{text}</Text>
      <Text style={styles.input} title='TimePicker' onPress={() => showMode('time') } >{time}</Text>
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
          <Button title="Speichern" onPress={() => Alert.alert("gespeichert")}>
            Button 1
          </Button>
        </View>
        <View style={styles.felx}>
          <Button title="Abbrechen" onPress={() => Alert.alert("abgebrochen")}>
            Button 2
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
  }
});

export default Appointment;
