import React from 'react';
import jwtDecode from 'jwt-decode'

import styles from '../styles/CalDots.module.css'

/**
 * Decode refresh token from API and save in local storage
 * @param {object} data Data returned from the API when the user logs in
 */
export const setTokenTimestamp = (data) => {
  // Use jwtDecode to decode the refresh token. Token expiry date is returned with a key of exp.
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem('refreshTokenTimestamp', refreshTokenTimestamp);
}

/**
 * Check if there is a refresh token
 * @returns boolean
 */
export const shouldRefreshToken = () => {
  return !!localStorage.getItem('refreshTokenTimestamp');
}

/**
 * Clean up local storage
 */
export const removeTokenTimestamp = () => {
  localStorage.removeItem('refreshTokenTimestamp');
}

/**
 * Check if there are any calendar events for the date passed in
 * and return a div to display on the calendar cell if there are
 * @param {object} calData Details of a date originating from the calendar
 * @param {object} events User's events data from the API
 * @returns {object} JSX div or null
 */
export const checkEventsForDate = (calData, events) => {
  // Get current date the calendar is asking about
  const { date } = calData;

  // Check events data against the date the calendar is asking about, and
  // return true if any matches are found
  const matchFound = events?.results?.reduce(
    (acc, event) => {
      // Get date from current event, get rid of the time data for both
      // the event date and calendar date and check for a match
      const eventDate = new Date(event.start);
      date.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      return date.toISOString() === eventDate.toISOString() || acc;
    }
  , false)
  
  // If match found, return a div to display in the calendar tile
  return (
    <div className={`${styles.CalDotDiv} block`}>
      {matchFound ? (
        <span className={`${styles.CalDot} w-5 h-1 md:w-2 md:h-2 lg:w-3 lg:h-3 rounded-full`}></span>
      ) : (
        null
      )} 
    </div>
  )
}

/**
 * // Find out if there are any events for a given date
 * @param {date} calDate Date to be checked
 * @param {object} events User's events data
 * @returns {Array} Array of events for the specific date
 */
export const getEventsForDay = (calDate, events) => {
  // Convert all dates to ISO strings without timezone data
  const calDateISOStr = calDate.toISOString().slice(0, -5);

  // Check each event against the date supplied by the calendar, and if the dates match add to a new array
  const eventsForDay = events?.results?.filter((event) => {
    const eventDate = new Date(event.start);
    eventDate.setHours(0, 0, 0);
    const eventDateISOStr = eventDate.toISOString().slice(0, -5);
    return eventDateISOStr === calDateISOStr;
  })
  return eventsForDay;
}
