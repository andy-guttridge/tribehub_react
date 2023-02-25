import jwtDecode from 'jwt-decode'
import styles from '../styles/CalDots.module.css'

// Data param is data returned from the API when user logs in.
export const setTokenTimestamp = (data) => {
  // Use jwtDecode to decode the refresh token. Token expiry date is returned with a key of exp.
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem('refreshTokenTimestamp', refreshTokenTimestamp);
}

// Check if there is a refresh token, if yes return true as user has been logged in.
export const shouldRefreshToken = () => {
  return !!localStorage.getItem('refreshTokenTimestamp');
}

// Clean up local storage
export const removeTokenTimestamp = () => {
  localStorage.removeItem('refreshTokenTimestamp');
}

// Check if this user has a calendar event for the date passed in by the calendar
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
      date.setHours(0, 0, 0, 0)
      eventDate.setHours(0, 0, 0, 0)
      return date.toISOString() === eventDate.toISOString() || acc
    }
  , false)
  
  // If match found, return a div to display in the calendar tile
  return (
    <div className={`${styles.CalDot} block`}>
      {matchFound ? (
        <span className="inline-block w-5 h-1 md:w-2 md:h-2 lg:w-3 lg:h-3 bg-primary rounded-full mb-2 lg:mb-0 md:mt-2 ml-2 md:ml-6 lg:ml-10"></span>
      ) : (
        null
      )}
      
    </div>
  )
}

// Find out if there are any events for the day supplied by the calendar
export const getEventsForDay = (calDate, events, e) => {
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
