import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../contexts/CurrentUserContext'
import { useSinglePage } from '../contexts/SinglePageContext';
import styles from '../styles/Calendar.module.css';

import Spinner from '../components/Spinner';
import { axiosReq } from '../api/axiosDefaults';
import { checkEventsForDate } from '../utils/utils';

function TribeHome() {
  // Get ref to current user
  const currentUser = useCurrentUser();

  // Hook for redirection
  const navigate = useNavigate();

  // Get ref to whether the app is displaying in single page mode
  const singlePage = useSinglePage();

  // Styles to apply if app is in single page mode
  const singlePageStyles = "basis-4/5 border-solid border-2 flex-none m-2";

  // State variables for loading status
  const [hasLoaded, setHasLoaded] = useState(false)

  // State variables for user's events
  const [events, setEvents] = useState({ results: [] });
  
  // Fetch user's events
  const fetchEvents = async (fromDate, toDate) => {

    // Convert fromDate and toDate to ISO strings for the API, and get rid of last 5 chars to eliminate timezone data
    const toDateStr = toDate.toISOString().slice(0, -5);
    const fromDateStr = fromDate.toISOString().slice(0, -5);
    try {
      const { data } = await axiosReq.get(`/events/?from_date=${fromDateStr}&to_date=${toDateStr}`)
      setEvents(data);
      setHasLoaded(true);
    }
    catch (errors) {
      return errors
    }
  }

  useEffect(() => {
    // Check if user logged in on mount, if not redirect to landing page
    !currentUser && navigate("/");
    setHasLoaded(false);

    // Set dates for fetching calendar data. Load data for 3 months before and after today.
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 3);
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + 3);

    // Fetch the data
    try {
      fetchEvents(fromDate, toDate)
    }
    catch (errors) {
      console.log(errors);
    }
  }, [currentUser])

  // Handle the user changing the calendar month by reloading events data with correct date range
  const handleCalMonthChange = (calData) => {

    // Set dates for fetching data based on the activeStartDate supplied by the calendar component
    const{ activeStartDate } = calData;
    const fromDate = new Date(activeStartDate.getTime());
    fromDate.setMonth(activeStartDate.getMonth() - 3 );
    const toDate = new Date(activeStartDate.getTime());
    toDate.setMonth(toDate.getMonth() + 3);

    // Fetch the data
    try {
      fetchEvents(fromDate, toDate);
    }
    catch (errors) {
      console.log(errors);
    }
  }

  return (

    // Apply some styling if displaying in single page mode
    <div
      className={
        singlePage ? singlePageStyles : undefined
      }
    >
      {hasLoaded ? (
        <>
          <h2>Home</h2>
          <div className="flex justify-center m-4">
            <Calendar
              className={`${styles.TribehubCalendar}`}
              calendarType="ISO 8601"
              minDetail="month"
              tileContent={(calData) => checkEventsForDate(calData, events)}
              onActiveStartDateChange={handleCalMonthChange}
            />
          </div>
          {events?.results?.map((event, idx) => <p key={idx}>{event.subject}</p>)}
        </>
      ) : (
        <Spinner />
      )}

    </div>
  )
}

export default TribeHome