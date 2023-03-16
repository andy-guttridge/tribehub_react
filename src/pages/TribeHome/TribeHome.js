import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import css from '../../styles/TribeHome.module.css'

function TribeHome() {
  /**
   * TribeHome page/section, including calendar and events
   */

  // State for loading status
  const [hasLoaded, setHasLoaded] = useState(false)

  // Current user
  const currentUser = useCurrentUser();

  // Hook for redirection
  const navigate = useNavigate();

  // Check if in single page mode
  const singlePage = useSinglePage();

  // Styles to apply if app is in single page mode
  const singlePageStyles = 'basis-4/5 mx-0.5 rounded-lg rounded-t-none border border-t-0 border-base-300 bg-base-100 col-span-2';

  // State for user's events
  const [events, setEvents] = useState({ results: [] });

  // State for specific day's events
  const [dayEvents, setDayEvents] = useState([]);

  // Errors
  const [errors, setErrors] = useState({});

  // String to confirm whether a change to data was successful
  const [actionSucceeded, setActionSucceeded] = useState('');

  // State for whether user has the add event form open
  const [isAddingNewEvent, setIsAddingNewEvent] = useState(false);

  // State for whether user is in the process of deleting an event
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

  // State for whether user has the search form open
  const [isSearching, setIsSearching] = useState(false);

  // Toggle when event details are saved.
  const [didSaveEvent, setDidSaveEvent] = useState(false)

  // Ref to current day so we can use it without making it a dependency in useCallback
  const currentDayRef = useRef(new Date());

  const fetchEvents = useCallback(
    /**
     * Function to fetch user's events and set them as values for the current calendar day
     * How to use useCallback hook to correctly declare a function outside of useEffect to enable
     * code re-use from https://stackoverflow.com/questions/56410369/can-i-call-separate-function-in-useeffect
     */
    async (fromDate, toDate, didChangeMonth = false) => {

      // Convert fromDate and toDate to ISO strings for the API, and get rid of last 5 chars to eliminate timezone data
      const toDateStr = toDate.toISOString().slice(0, -5);
      const fromDateStr = fromDate.toISOString().slice(0, -5);
      try {
        const { data } = await axiosReq.get(`/events/?from_date=${fromDateStr}&to_date=${toDateStr}`)
        setEvents(data);
        setHasLoaded(true);

        // Set events for currently selected calendar day, unless user changed calendar
        // month, in which case we don't want them to be reset as the day stays the same.
        if (!didChangeMonth) {

          // Set the current day so that we can reference this to ensure the calendar stays on the same day when it remounts/data reloads.
          // We have to add any timezone offset, as the date stored in currentDayRef by the calendar will have had any offset removed.
          const tzOffset = currentDayRef.current.getTimezoneOffset();

          // How to add a number of minutes to a JS DateTime object is adapted from
          // https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
          const dateWithTimezone = new Date(currentDayRef.current.getTime() + tzOffset * (60000));
          setDayEvents(getEventsForDay(dateWithTimezone, data));
        }
        setErrors({});
      } catch (error) {
        if (error.response?.status !== 401) {
          setErrors({ calendarError: 'There was an error loading calendar data.' })
          setHasLoaded(true);
        }
      }
    }
    , [])

  const handleDeleteButton = (eventId) => {
    /**
     * Handle user pressing delete event button by storing event id
     */
    setIsDeletingEvent(eventId);
  }

  const doDelete = async () => {
    /**
     * Handle user confirmation of event deletion
     */
    try {
      await axiosReq.delete(`events/${isDeletingEvent}/`);
      setDidSaveEvent(!didSaveEvent);
      setActionSucceeded('The event has now been deleted')
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors({ delete: 'There was an error deleting this calendar event.\n\n You may be offline or there may have been a server error.' })
      }
    }
    setIsDeletingEvent(false);
  }

  useEffect(() => {
    /**
     * Get event data on mount
     */

    // Set dates for fetching calendar data. Load data for 3 months before and after today.
    const fromDate = new Date(currentDayRef.current);
    fromDate.setMonth(fromDate.getMonth() - 12);
    const toDate = new Date(currentDayRef.current);
    toDate.setMonth(toDate.getMonth() + 12);

    // Fetch the data
    fetchEvents(fromDate, toDate);
  }, [didSaveEvent, fetchEvents])

  useEffect(() => {
    /**
     * Check if user logged in on mount, if not redirect to landing page.
     * Ensure top of page is visible if not in single page mode.
     */

    !currentUser && navigate('/');
    !singlePage && window.scrollTo(0, 0);
  }, [currentUser, navigate, singlePage])

  const handleCalMonthChange = (calData) => {
    /**
     * Handle the user changing the calendar month by reloading events data with correct date range
     */

    // Set dates for fetching data based on the activeStartDate supplied by the calendar component
    const { activeStartDate } = calData;
    const fromDate = new Date(activeStartDate.getTime());
    fromDate.setMonth(activeStartDate.getMonth() - 12);
    const toDate = new Date(activeStartDate.getTime());
    toDate.setMonth(toDate.getMonth() + 12);

    // Fetch the data. Pass true to tell fetchEvents it is being called
    // in response to the user changing the calendar month.
    fetchEvents(fromDate, toDate, true);
  }

  useEffect(() => {
    /**
     * Set timeout and get rid of any success alert
     */
    const hideSuccess = setTimeout(() => {
      setActionSucceeded('');
    }, 5000);

    // Cleanup
    return () => { clearTimeout(hideSuccess) }
  }, [actionSucceeded]);

  return (
    // Apply some styling depending on whether displaying in single page mode
    <section
      className={
        `${singlePage ? singlePageStyles : 'bg-base-100'}`
      }
    >
      <h2>Home</h2>
      <h3 className="break-all">{currentUser?.tribe_name}</h3>

      {/* Display generic alert if problems loading calendar data */}
      {
        errors.calendarError && (
          <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
            <div>
              <InfoCircle size="32" className="m-auto" />
            </div>
            <div>
              <p>There was a problem fetching calendar data. You are either offline, or a server error has occurred.</p>
            </div>
          </div>
        )
      }

      {hasLoaded ? (
        <>
          <div className="lg:grid lg:grid-cols-2">

            {/* Calendar */}
            <div className="flex justify-center lg:m-2">
              <Calendar
                className={`${styles.TribehubCalendar}`}
                calendarType="ISO 8601"
                minDetail="month"
                tileContent={(calData) => checkEventsForDate(calData, events)}
                onActiveStartDateChange={handleCalMonthChange}
                defaultValue={currentDayRef.current}
                onClickDay={(calDate, event) => {
                  // Set the current day so that we can reference this to ensure the calendar stays on the same day when it remounts/data reloads.
                  // We have to subtract any timezone offset, as directly converting the date from the calendar component to ISOString causes problems e.g.
                  // the date sent to the form will be one day early when it's British summer time.
                  const tzOffset = calDate.getTimezoneOffset();

                  // How to add a number of minutes to a JS DateTime object is adapted from
                  // https://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
                  const dateWithoutTimezone = new Date(calDate.getTime() + tzOffset * (-60000));
                  currentDayRef.current = dateWithoutTimezone;
                  setDayEvents(getEventsForDay(calDate, events, event));
                }}
              />
            </div>

            <div>
              {/* Display alert with success message if a request resulting in change of data succeeded */}
              {
                actionSucceeded !== '' &&
                <div className="fixed min-h-fit min-w-full top-0 left-0 z-10">
                  <div className="alert alert-success justify-start w-3/4 md:w-1/2 lg:w-1/2 mx-auto mt-14">
                    <div>
                      <InfoCircle size="32" /><span>{actionSucceeded}</span>
                    </div>
                  </div>
                </div>
              }

              {/* Display alert if there was an issue deleting a calender event */}
              {
                errors.delete &&
                <div className="h-fit alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
                  <div>
                    <InfoCircle size="32" />
                  </div>
                  <div>
                    <p>{errors.delete}</p>
                  </div>
                </div>
              }

              {/* Button to search, search form, button to add new event add new event form */}
              <div className="justify-end lg:justify-start flex md:w-2/3 lg:w-full mx-auto my-4">

                {/* Add new event button and form */}
                {
                  !isAddingNewEvent && !isSearching ? (
                    <button onClick={() => setIsAddingNewEvent(!isAddingNewEvent)} className="btn btn-ghost" id="add-new-event-btn">
                      <PlusCircle size="32" className="text-primary" /><span className="sr-only">Add new calendar event</span>
                    </button>
                  ) : isAddingNewEvent && (
                    <EventDetailsForm
                      handleCancelButton={() => setIsAddingNewEvent(!isAddingNewEvent)}
                      didSaveEvent={didSaveEvent}
                      setDidSaveEvent={setDidSaveEvent}
                      // Pass currently selected calendar day in correct format to the form, to populate the starting value for the date of the event
                      defaultStartDate={`${currentDayRef.current.toISOString().substring(0, 10)}T12:00`}
                      setActionSucceeded={setActionSucceeded}
                    />
                  )
                }

                {/* Search button and form */}
                {
                  !isSearching && !isAddingNewEvent ? (
                    <button onClick={() => setIsSearching(!isSearching)} className="btn btn-ghost" id="search-events-btn">
                      <Search size="32" className="text-primary" /><span className="sr-only">Search calendar events</span>
                    </button>
                  ) : isSearching && (
                    <EventSearch
                      handleCancelButton={() => setIsSearching(!isSearching)}
                    />
                  )
                }
              </div>

              {/* Event details for selected day */}
              {/* Do not show these if in search mode */}
              {
                !isSearching && dayEvents?.length > 0 &&
                <div className={`${singlePage ? (css.DisplayEvents) : "bg-base-200"} w-full md:inline-block lg:block`} >
                  {
                    dayEvents?.map((dayEvent) => {
                      // We pass didSaveEvent and setDidSaveEvent through to the CalEvent so that it in turn can pass them to its children if the user edits an event
                      return <CalEvent
                        event={dayEvent}
                        key={`event-${dayEvent.id}-${dayEvent.start}`}
                        calEventId={`event-${dayEvent.id}-${dayEvent.start}`}
                        didSaveEvent={didSaveEvent}
                        setDidSaveEvent={setDidSaveEvent}
                        handleDeleteButton={handleDeleteButton}
                        setActionSucceeded={setActionSucceeded}
                      />
                    })
                  }
                </div>
              }
            </div>
          </div>
          {
            // Empty div with margin to provide clearance above bottom navbar if not in single page mode
            !singlePage && <div className="mb-4 bg-base-100"><br /></div>
          }
        </>
      ) : (
        <Spinner />
      )}

      {/* If tribe admin or event owner has selected to delete an event, show the modal to confirm or cancel */}
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
    </ section>
  )
}

export default TribeHome