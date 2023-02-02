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

  useEffect(() => {
    // Check if user logged in on mount, if not redirect to landing page
    !currentUser && navigate("/");

    // Fetch user's events
    const fetchEvents = async () => {
      try {
        const { data } = await axiosReq.get('/events/')
        setEvents(data);
        setHasLoaded(true);
      }
      catch (errors) {
        console.log(errors);
      }
    }
    setHasLoaded(false);
    fetchEvents();
  }, [currentUser])

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