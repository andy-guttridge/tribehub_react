import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import { useSinglePage } from '../../contexts/SinglePageContext';
import styles from '../../styles/Calendar.module.css';
import Spinner from '../../components/Spinner';
import { axiosReq } from '../../api/axiosDefaults';
import { checkEventsForDate, getEventsForDay } from '../../utils/utils';
import CalEvent from './CalEvent';

function TribeHome() {

  // State variables for loading status
  const [hasLoaded, setHasLoaded] = useState(false)

  // Get ref to current user
  const currentUser = useCurrentUser();

  // Hook for redirection
  const navigate = useNavigate();

  // Get ref to whether the app is displaying in single page mode
  const singlePage = useSinglePage();

  // Styles to apply if app is in single page mode
  const singlePageStyles = "basis-4/5 border-solid border-2 m-2";

  // State variables for user's events
  const [events, setEvents] = useState({ results: [] });

  // State variables for specific day's events
  const [dayEvents, setDayEvents] = useState([]);

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
    // Set dates for fetching calendar data. Load data for 3 months before and after today.
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 12);
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + 12);

    // Fetch the data
    try {
      fetchEvents(fromDate, toDate)
    }
    catch (errors) {
      console.log(errors);
    }
  }, [])

  useEffect(() => {
    // Check if user logged in on mount, if not redirect to landing page
    !currentUser && navigate("/");
  }, [currentUser])

  // Handle the user changing the calendar month by reloading events data with correct date range
  const handleCalMonthChange = (calData) => {

    // Set dates for fetching data based on the activeStartDate supplied by the calendar component
    const { activeStartDate } = calData;
    const fromDate = new Date(activeStartDate.getTime());
    fromDate.setMonth(activeStartDate.getMonth() - 12);
    const toDate = new Date(activeStartDate.getTime());
    toDate.setMonth(toDate.getMonth() + 12);

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
        `${singlePage ? singlePageStyles : ''}`
      }
    >
      <h2>Home</h2>
      {hasLoaded ? (

        // Calendar
        <>
          <div>
            <div className="flex justify-center">
              <Calendar
                className={`${styles.TribehubCalendar}`}
                calendarType="ISO 8601"
                minDetail="month"
                tileContent={(calData) => checkEventsForDate(calData, events)}
                onActiveStartDateChange={handleCalMonthChange}
                onClickDay={(calDate, event) => setDayEvents(getEventsForDay(calDate, events, event))}
              />
            </div>

            {/* Event details for selected day */}
            <div className="max-h-96 inline-block w-4/5 overflow-scroll">
              {
                dayEvents?.map((dayEvent, i) => {
                  return <CalEvent event={dayEvent} key={`event-${dayEvent.id}`} />
                })
              }
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </ div>
  )
}

export default TribeHome