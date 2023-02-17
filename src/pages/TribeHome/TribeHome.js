import React, { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
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
import { InfoCircle, PlusCircle, Search } from 'react-bootstrap-icons';
import EventDetailsForm from './EventDetailsForm';
import ConfirmModal from '../../components/ConfirmModal';
import EventSearch from './EventSearch';

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

  // State variables for API errors
  const [errors, setErrors] = useState({});

  // State variables for whether user has the add event form open
  const [isAddingNewEvent, setIsAddingNewEvent] = useState(false);

  // State variables for whether user is in the process of deleting an event
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

  // State variable for whether user has the search form open
  const [isSearching, setIsSearching] = useState(false);

  // State variable used as a flag when event details are saved.
  // This is simply toggles to trigger events to reload when there has been a change.
  const [didSaveEvent, setDidSaveEvent] = useState(false)

  // State variable for current calendar day selected by user
  const [currentDay, setCurrentDay] = useState(new Date());

  // Function to fetch user's events and set them as values for the current calendar day
  // How to use useCallback hook to correctly declare a function outside of useEffect to enable
  // code re-use from https://stackoverflow.com/questions/56410369/can-i-call-separate-function-in-useeffect
  const fetchEvents = useCallback(
    async (fromDate, toDate) => {

      // Convert fromDate and toDate to ISO strings for the API, and get rid of last 5 chars to eliminate timezone data
      const toDateStr = toDate.toISOString().slice(0, -5);
      const fromDateStr = fromDate.toISOString().slice(0, -5);
      try {
        const { data } = await axiosReq.get(`/events/?from_date=${fromDateStr}&to_date=${toDateStr}`)
        setEvents(data);
        setHasLoaded(true);

        // Set events for currently selected calendar day
        setDayEvents(getEventsForDay(currentDay, data));
        setErrors({});
      }
      catch (error) {
        if (error.response?.status !== 401) {
          setErrors({ calendarError: 'There was an error loading calendar data.' })
          setHasLoaded(true);
        }
      }
    }
  )

  // Handle user pressing delete event button by storing the event id.
  const handleDeleteButton = (eventId) => {
    setIsDeletingEvent(eventId);
  }

  // Delete event when user has confirmed they wish to do so.
  const doDelete = async () => {
    try {
      await axiosReq.delete(`events/${isDeletingEvent}/`);
      setDidSaveEvent(!didSaveEvent);
    }
    catch (error) {
      setErrors({ delete: 'There was an error deleting this calendar event.\n\n You may be offline or there may have been a server error.' })
    }
    setIsDeletingEvent(false);
  }

  useEffect(() => {
    // Set dates for fetching calendar data. Load data for 3 months before and after today.
    setHasLoaded(false);
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 12);
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + 12);

    // Fetch the data
    fetchEvents(fromDate, toDate)

  }, [didSaveEvent])

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
    fetchEvents(fromDate, toDate);
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
                defaultValue={currentDay}
                onClickDay={(calDate, event) => {
                  // Set the current day so that we can reference this to ensure the calendar stays on the same day when it remounts/data reloads.
                  // We have to compensate for any timezone offset, as directly converting the date from the calendar component to ISOString causes problems e.g.
                  // the date sent to the form will be one day early when it's British summer time.
                  const tzOffset = calDate.getTimezoneOffset();

                  // How to add a number of minutes to a JS DateTime object is adapted from
                  // https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
                  const dateWithoutTimezone = new Date(calDate.getTime() + tzOffset * (-60000));
                  setCurrentDay(dateWithoutTimezone);
                  setDayEvents(getEventsForDay(calDate, events, event));
                }}
              />
            </div>

            {/* Display generic alert if problems loading calendar data */}
            {
              errors.calendarError && (
                <div className="alert alert-warning w-3/4 inline-block m-4 justify-center text-center">
                  <InfoCircle size="32" className="m-auto" />
                  <p className="text-center inline-block">There was a problem fetching calendar data.</p>
                  <p className="text-center inline-block">You are either offline, or a server error has occurred.</p>
                </div>
              )
            }

            {/* Display alert if there was an issue deleting a calender event */}
            {
              errors.delete &&
              <div className="alert alert-warning w-3/4 inline-block m-4 justify-center text-center">
                <InfoCircle size="32" className="inline-block" /><p>{errors.delete}</p>
              </div>
            }


            {/* Event details for selected day */}
            {/* Do not display these if in search mode */}
            {
              !isSearching && 
              <div className="max-h-96 inline-block w-4/5 overflow-scroll">
                {
                  dayEvents?.map((dayEvent) => {
                    // We pass didSaveEvent and setDidSaveEvent through to the CalEvent so that it in turn can pass them to its children if the user edits an event
                    return <CalEvent event={dayEvent} key={`event-${dayEvent.id}`} didSaveEvent={didSaveEvent} setDidSaveEvent={setDidSaveEvent} handleDeleteButton={handleDeleteButton} />
                  })
                }
              </div>
            }
          </div>
        </>
      ) : (
        <Spinner />
      )}


      {/* Button to search, search form, button to add new event add new event form */}
      <div className="justify-end flex w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">

        {/* Add new event button and form */}
        {
          !isAddingNewEvent && !isSearching ? (
            <button onClick={() => setIsAddingNewEvent(!isAddingNewEvent)} className='btn btn-ghost'><PlusCircle size="32" /><span className="sr-only">Add new calendar event</span></button>
          ) : isAddingNewEvent && (
            <EventDetailsForm
              handleCancelButton={() => setIsAddingNewEvent(!isAddingNewEvent)}
              didSaveEvent={didSaveEvent}
              setDidSaveEvent={setDidSaveEvent}
              // Pass currently selected calendar day in correct format to the form, to populate the starting value for the date of the event
              defaultStartDate={`${currentDay.toISOString().substring(0, 10)}T12:00`}
            />
          )
        }

        {/* Search button and form */}
        {
          !isSearching && !isAddingNewEvent ? (
            <button onClick={() => setIsSearching(!isSearching)} className='btn btn-ghost'><Search size="32" /><span className="sr-only">Search calendar events</span></button>
          ) : isSearching && (
            <EventSearch 
              handleCancelButton={() => setIsSearching(!isSearching)}
            />
          )
        }
      </div>

      {/* If tribe admin has selected to delete an event, show the modal to confirm or cancel */}
      {/* // Technique to use ReactDOM.createPortal to add a modal to the end of the DOM body from
          // https://upmostly.com/tutorials/modal-components-react-custom-hooks */}
      {
        isDeletingEvent && ReactDOM.createPortal(
          <ConfirmModal
            heading="Delete event"
            body={`Are	you sure you want to delete this event?\n\nIf you choose to delete an event or one of its repeats, all occurrences will be removed.`}
            cancelHandler={() => setIsDeletingEvent(false)}
            confirmHandler={doDelete}
          />, document.body)
      }
    </ div>
  )
}

export default TribeHome