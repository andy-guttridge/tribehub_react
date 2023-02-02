import jwtDecode from "jwt-decode"
import styles from '../styles/CalDots.module.css'


// data param is data returned from the API when user logs in.
export const setTokenTimestamp = (data) => {
  // Use jwtDecode to decode the refresh token. Token expiry date is returned with a key of exp.
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
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

  // Flag for matching events
  let matchFound = false;

  // Map through events data, flag any where the date matches the date the calendar
  // is asking about
  events?.results?.map(
    (event) => {

      // Get date from current event, get rid of the time data for both
      // the event date and calendar date and check for a match
      const eventDate = new Date(event.start);
      date.setHours(0, 0, 0, 0)
      eventDate.setHours(0, 0, 0, 0)
      if(date.toISOString() === eventDate.toISOString()){
        matchFound = true;
      }
    }
  )
  // If match found, return a div to display in the calendar tile
  return (
    <div className={`${styles.CalDot} block`}>
      {matchFound ? (
        <span className="inline-block w-5 h-1 md:w-2 md:h-2 lg:w-3 lg:h-3 bg-secondary rounded-full mb-2 lg:mb-0 md:mt-2 ml-2 md:ml-6 lg:ml-10"></span>
      ) : (
        null
      )}
      
    </div>
  )
}
