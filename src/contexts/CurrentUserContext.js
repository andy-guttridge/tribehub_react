import { useState, createContext, useContext, useEffect, useMemo} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import React from 'react';

import { removeTokenTimestamp, shouldRefreshToken } from '../utils/utils';

/* Code in this file adapted from the Code Institute 'Moments' React walkthrough project.
Create a user context to allow user details to be accessed throughout the app, and setup
axios interceptors to refresh tokens. */

//  Create contexts and hooks
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Create a Provider to provide context to children
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  
  // Get current user from API
  const handleMount = async () => {
    try {
      const {data} = await axiosRes.get('dj-rest-auth/user/');
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
  
  // Check tokens and refresh if needed before components mount
  useMemo (() => {
    // Create request interceptor
    axiosReq.interceptors.request.use(

      // Check if there is a refresh token, if yes request a refresh. If error, redirect to sign-in page if
      // user was previously logged in.
      async(config) => {
        if (shouldRefreshToken()){
          try {
              await axiosRes.post('/dj-rest-auth/token/refresh/');
          }
          catch(error){
              setCurrentUser((prevCurrentUser) => {
                  if(prevCurrentUser) {
                      navigate('/signin');
                  }
                  return null;
              });

              // If user was logged out, remove the token.
              removeTokenTimestamp();
              return config;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Create response interceptor
    axiosRes.interceptors.response.use(
      // If all ok, return the response
      (response) => response,

      // If user not authorised, try to refresh token. If that doesn't work,
      // navigate back to sign-in page if the user was previously logged in.
      async (error) => {
        if(error.response?.status == 401) {
          try {
            await axios.post('dj-rest-auth/token/refresh/')
          }
          catch(error) {
            setCurrentUser((prevCurrentUser) => {
              if(prevCurrentUser){
                navigate('/signin')
              }
              return null;
            });

            // If user was logged out, remove the token.
            removeTokenTimestamp();
            return axios(error.config);
          }
          return Promise.reject(error);
        }
      }
    )
  }, [navigate])

  // Return providers for children to subscribe to
  return (
    <CurrentUserContext.Provider  value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  )
};

