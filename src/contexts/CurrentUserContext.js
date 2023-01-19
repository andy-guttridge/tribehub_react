import { useState, createContext, useContext, useEffect} from 'react';
import axios from "axios";

import React from 'react'

// Code in this file adapted from the Code Institute 'Moments' React walkthrough project

//  Create contexts and hooks
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Create a Provider to provide context to children
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Get current user from API
  const handleMount = async () => {
    try {
      const {data} = await axios.get('dj-rest-auth/user/');
      setCurrentUser(data);
    }
    catch(error) {
      console.log(error);
    }
  }

  // Get the current user from the API when component mounted
  useEffect(() => {
    handleMount()
  }, [])

  // Return providers for children to subscribe to
  return (
    <CurrentUserContext.Provider  value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  )
};

