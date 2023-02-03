import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import styles from '../../styles/Calendar.module.css';
import Spinner from '../../components/Spinner';
import { axiosReq } from '../../api/axiosDefaults';
import { checkEventsForDate, getEventsForDay } from '../../utils/utils';

function TribeCal( {handleCalDaySelect }) {

  // State variables for loading status
  const [hasLoaded, setHasLoaded] = useState(false)

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
    <>
      {hasLoaded ? (
        <>
          <div className="inline-block m-4">
            <Calendar
              className={`${styles.TribehubCalendar}`}
              calendarType="ISO 8601"
              minDetail="month"
              tileContent={(calData) => checkEventsForDate(calData, events)}
              onActiveStartDateChange={handleCalMonthChange}
              onClickDay={(calDate, event) => handleCalDaySelect(getEventsForDay(calDate, events, event))}
            />
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default TribeCal