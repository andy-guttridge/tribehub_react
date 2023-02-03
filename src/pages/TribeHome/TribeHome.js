import React, { useEffect, useState } from 'react'
import 'react-calendar/dist/Calendar.css';

import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import { useSinglePage } from '../../contexts/SinglePageContext';

import TribeCal from './TribeCal';
import CalEvent from './CalEvent';

function TribeHome() {
  // Get ref to current user
  const currentUser = useCurrentUser();

  // Hook for redirection
  const navigate = useNavigate();

  // Get ref to whether the app is displaying in single page mode
  const singlePage = useSinglePage();

  // Styles to apply if app is in single page mode
  const singlePageStyles = "basis-4/5 border-solid border-2 m-2";

  // State variables for specific day's events
  const [dayEvents, setDayEvents] = useState([]);

  const handleCalDaySelect = (events) => {
    setDayEvents(events);
    console.log(dayEvents);
  }

  useEffect(() => {
    // Check if user logged in on mount, if not redirect to landing page
    !currentUser && navigate("/");
    console.log('did useEffect')
  }, [currentUser, dayEvents])

  return (

    // Apply some styling if displaying in single page mode
    <div
      className={
        `${singlePage ? singlePageStyles : ''}`
      }
    >
      <h2>Home</h2>
      <TribeCal handleCalDaySelect={handleCalDaySelect}/>
      {
        dayEvents?.map((dayEvent) => {
          return <CalEvent event={dayEvent}/>
        })
      }
    </div>
  )
}

export default TribeHome