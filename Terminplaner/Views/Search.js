import {useEffect, useState} from "react";
import { SafeAreaView, FlatList, TextInput } from 'react-native';

import {getCalendar} from '../Utils/Storage';
import Event from '../Components/Event'

import { useCurrentUserContext } from '../Utils/userContext';

//The event search screen. Allows the user to search for events based on their titles.
export default function Search({ navigation }){
    const {
        username: currentUser
    } = useCurrentUserContext();

    const [mainCalendar, setMainCalendar] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchString, setSearchString] = useState("");

    //Get the current user's full calendar on loading this component 
    useEffect(() => {
        async function initializeCalendar(){
            const userCalendar = await getCalendar(currentUser);
            setMainCalendar(userCalendar);
            setSearchResults(userCalendar);
        }
        initializeCalendar();
    }, [])

    //Every time the search string changes (or the main calendar gets loaded), update the search results
    useEffect(() => {
        function compareEvents(eventA, eventB){
            return new Date(eventA.start) - new Date(eventB.start);
        }

        const lowerSearchString = searchString.toLowerCase();

        let newSearchResults = mainCalendar.filter((calendarEvent) => 
            calendarEvent.title.toLowerCase().includes(lowerSearchString));
        newSearchResults = newSearchResults.sort(compareEvents);
        setSearchResults(newSearchResults);
    }, [searchString, mainCalendar]);

    function renderCalendarItem({ item: calendarItem }){
        return (<Event calendarItem={calendarItem} navigation={navigation}/>)
    }

    return (
        <SafeAreaView style={{flex: 1}} className="p-1">
            <TextInput
                placeholder="Suchbegriff"
                className="top-4 border-2 border-stone-400 rounded-md p-2 w-80 h-11 mb-8"
                value={searchString}
                onChangeText={setSearchString}
            />
            <FlatList   data={searchResults}
                        renderItem={renderCalendarItem} 
                        keyExtractor={(item) => `${item.start}${item.end}${item.title}`}
                        style={{flexGrow: 1}}/>
        </SafeAreaView>  
    )
}