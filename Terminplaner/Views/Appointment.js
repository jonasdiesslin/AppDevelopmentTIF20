import React from "react";
import {useState} from "react";
import {
  View,
  Button,
  SafeAreaView,
  StyleSheet,
  Switch,
  TextInput,
  Text,
  Alert
} from "react-native";

const Appointment = ({ navigation }) => {
  const [titel, onChangeTitel] = useState();
  const [comment, onChangeComment] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView>
      <Text style={styles.header}>
        Neuer Termin
      </Text>
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
      <View style={styles.container}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
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
  }
});

export default Appointment;
