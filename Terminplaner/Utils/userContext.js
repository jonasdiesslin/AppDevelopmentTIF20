import React from "react";

//This file creates a context which contains various functions and variables for session management.
//Created once in App.js and used in most Screens.

//Set up a context to store and manage the current user
export const currentUserContext = React.createContext({});

//Declare a function to access the currentUserContext
export const useCurrentUserContext = () => React.useContext(currentUserContext)