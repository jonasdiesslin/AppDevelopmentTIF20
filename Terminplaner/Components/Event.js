import { StyleSheet, View, Text, TouchableHighlight } from "react-native";

import { padWithLeadingZero } from "../Utils/Calendar";

//This component can display basic information for a single calendar entry
export default function Event({ calendarItem, navigation }) {
    const startDate = new Date(calendarItem.start)
    const endDate = new Date(calendarItem.end)

    //Nicely format start and end times
    const startTimeString = `${startDate.getHours()}:${padWithLeadingZero(startDate.getMinutes())}`
    const endTimeString = `${endDate.getHours()}:${padWithLeadingZero(endDate.getMinutes())}`

    //Nicely format calendar date
    const calendarDateString = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`

    return (
        <TouchableHighlight 
            classNames=""
            activeOpacity={0.9}
            underlayColor="grey"
            onPress={() => {navigation.navigate("EventDetails", {calendarItem: calendarItem})}}
        >
            <View>
                <Text>{calendarItem.title}</Text>
                <Text>{startTimeString} - {endTimeString}</Text>
                <Text>{calendarDateString}</Text>

                <View style = {styles.viewStyleForLine}></View>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    viewStyleForLine: {
        borderBottomColor: "gray", 
        borderBottomWidth: StyleSheet.hairlineWidth,
        alignSelf:'center',
        width: "98%"
    }
})