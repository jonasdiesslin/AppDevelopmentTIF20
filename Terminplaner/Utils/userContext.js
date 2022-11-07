import React from "react";

//Set up a context to store and manage the current user
export const currentUserContext = React.createContext({});

//Declare a function to access the currentUserContext
export const useCurrentUserContext = () => React.useContext(currentUserContext)