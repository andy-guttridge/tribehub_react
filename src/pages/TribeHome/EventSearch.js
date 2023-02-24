import React, { useEffect, useRef, useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons';
import ReactDOM from 'react-dom'

import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import ConfirmModal from '../../components/ConfirmModal';
import Spinner from '../../components/Spinner';
import { eventCategories } from '../../utils/constants';
import CalEvent from './CalEvent';

function EventSearch({ handleCancelButton }) {

  // State variables for user's tribe members
  const [tribe, setTribe] = useState({ results: [] });

  // State variables for errors
  const [errors, setErrors] = useState({});

  // State variable for if required data from the API has loaded
  const [hasLoaded, setHasLoaded] = useState(false);

  // State variable used as a flag when event details are saved.
  // This is simply toggles to trigger events to reload when there has been a change.
  const [didSaveEvent, setDidSaveEvent] = useState(false)

  // State variables for whether user is in the process of deleting an event.
  // If user is deleting event, the id of the event is stored here.
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

  // State variables for search values
  const [searchValues, setSearchValues] = useState({
    text_search: '',
    category_search: '',
    tribe_to: [],
    tribe_from: '',
    from_date: undefined,
    to_date: undefined
  })

  // Retrieve search values from state variables
  const { text_search, category_search, tribe_to, tribe_from, to_date, from_date } = searchValues;

  // State variables for events
  const [events, setEvents] = useState({ results: [] })

  // References to from and to date form fields
  const fromInput = useRef(null);
  const toInput = useRef(null);

  // Fetch user's tribe members
  useEffect(() => {
    const fetchTribe = async () => {
      try {
        setHasLoaded(false);
        const { data } = await axiosRes.get('tribe/');
        setTribe(data);
        setHasLoaded(true);
        setErrors({});
      } catch (error) {
        setErrors({ tribe: 'There was an error loading tribe data. You may be offline, or there may have been a server error' })
      }
    }
    fetchTribe();
  }, [])

  // Fetch events according to search values
  useEffect(() => {

    // Create URL parameter strings for text_search and the category and tribe search arrays, then concatenate
    const textSearch = `?search=${text_search}`;
    const categorySearch = category_search ? `&category=${category_search}` : '';
    const tribeToSearch = tribe_to.reduce((acc, tribeMember) => acc + `&to=${tribeMember}`, '');
    const tribeFromSearch = tribe_from ? `&user=${tribe_from}` : '&user=';
    const toDateString = to_date && new Date(to_date).toISOString().slice(0, -5);
    const toSearchString = to_date ? `&to_date=${toDateString}` : '';
    const fromDateString = from_date && new Date(from_date).toISOString().slice(0, -5);
    const fromSearchString = from_date ? `&from_date=${fromDateString}` : '';
    const finalSearchString = textSearch.concat(categorySearch, tribeToSearch, tribeFromSearch, fromSearchString, toSearchString)

    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        setHasLoaded(false);
        const { data } = await axiosRes.get(`events/${finalSearchString}`);
        setEvents(data);
        setHasLoaded(true);
        setErrors({});
        console.log(data);
      } catch (error) {
        setErrors({ events: 'There was an error loading search results. You may be offline, or there may have been a server error.' });
      }
    }

    // Technique for using a timer to reduce number of network requests is from
    // Code Institute's Moments walkthrough project
    const timer = setTimeout(() => {
      fetchEvents();
    }, 1000);

    return () => {
      clearTimeout(timer);
    }
  }, [searchValues, didSaveEvent])

  // Handle user pressing delete event button by storing the event id.
  const handleDeleteButton = (eventId) => {
    setIsDeletingEvent(eventId);
  }

  // Change handler for text search field
  const handleChange = (e) => {
    setSearchValues({
      ...searchValues,
      [e.target.name]: e.target.value
    }
    )

    // Validate date inputs to make sure the from date is not before the to date,
    // and state value and form input values if so.
    if (e.target.name === 'from_date' && e.target.value > searchValues.to_date) {
      setSearchValues({
        ...searchValues,
        to_date: from_date
      })
      toInput.value = fromInput.value;
    }
    if (e.target.name === 'to_date' && e.target.value < searchValues.from_date) {
      setSearchValues({
        ...searchValues,
        from_date: to_date
      })
      fromInput.value = toInput.value;
    }
  }

  // Change handler for multiple selection form fields
  // Code to handle multiple selections in controlled React forms is from
  // https://stackoverflow.com/questions/50090335/how-handle-multiple-select-form-in-reactjs
  const handleMultipleSelectChange = (e) => {
    // Get full array of options from click event, and map over them
    // to find out if they are selected - if so, add to array
    const options = Array.from(e.target.options);
    const searchValue = [];
    options.map((option) => {
      return option.selected && searchValue.push(option.value)
    })

    // Set value of the form element using the array
    setSearchValues({
      ...searchValues,
      [e.target.name]: searchValue
    })
  }

  // Delete event when user has confirmed they wish to do so.
  const doDelete = async () => {
    try {
      await axiosReq.delete(`events/${isDeletingEvent}/`);
      setDidSaveEvent(!didSaveEvent);
      setErrors({});
    } catch (error) {
      setErrors({ delete: 'There was an error deleting this calendar event.\n\n You may be offline or there may have been a server error.' })
    }
    setIsDeletingEvent(false);
  }

  return (
    <div className="basis-full">
      <h3>Search events</h3>

      {/* Display alert if there was an issue fetching tribe data */}
      {
        errors.tribe &&
        <div className="alert alert-warning w-3/4 inline-block m-4 justify-center text-center">
          <InfoCircle size="32" className="inline-block" /><p>{errors.tribe}</p>
        </div>
      }

      {/* Display alert if there was an issue fetching events data */}
      {
        errors.events &&
        <div className="alert alert-warning w-3/4 inline-block m-4 justify-center text-center">
          <InfoCircle size="32" className="inline-block" /><p>{errors.events}</p>
        </div>
      }

      <form>

        {/* Text search field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="text-search">
          <span>Text search:</span>
          <input
            type="text"
            className="input input-bordered w-full"
            id="text_search"
            name="text_search"
            value={text_search}
            onChange={handleChange}
          />
        </label>

        {/* Category search field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="category-search">
          <span>Category:</span>

          {/* How to iterate over values of an object in React is from */}
          {/* https://stackoverflow.com/questions/40803828/how-can-i-map-through-an-object-in-reactjs */}
          <select
            className="input input-bordered w-full"
            id="category_search"
            name="category_search"
            value={category_search}
            onChange={handleChange}
          >
            <option value="" key="empty-category">--</option>
            {
              Object.keys(eventCategories).map((keyName) => {
                return <option value={keyName} key={`category-${keyName}`}>{eventCategories[keyName].text}</option>
              })
            }
          </select>
        </label>

        {/* Tribe members search field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="tribe-search">
          <span>Tribe members invited:</span>
          <select
            className="input input-bordered w-full"
            id="tribe_to"
            name="tribe_to"
            value={tribe_to}
            onChange={handleMultipleSelectChange}
            multiple={true}
          >
            {
              tribe?.results[0]?.users?.map((tribeMember) => {
                return <option value={tribeMember.user_id} key={`tribe-${tribeMember.user_id}`}>{tribeMember.display_name}</option>
              })
            }
          </select>
        </label>

        {/* Tribe members from field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="tribe-search">
          <span>Tribe member sent from:</span>
          <select
            className="input input-bordered w-full"
            id="tribe_from"
            name="tribe_from"
            value={tribe_from}
            onChange={handleMultipleSelectChange}
          >
            <option value={""} key={"blank-from-option"}>--</option>
            {
              tribe?.results[0]?.users?.map((tribeMember) => {
                return <option value={tribeMember.user_id} key={`tribe-${tribeMember.user_id}`}>{tribeMember.display_name}</option>
              })
            }
          </select>
        </label>

        {/* From date field */}
        <p className='text-sm text-left md:text-center'>You'll get events for the next two months if you don't enter dates</p>
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="start">
          <span>From date:</span>
          <input
            type="date"
            className="input input-bordered w-full"
            id="from_date"
            name="from_date"
            value={from_date}
            onChange={handleChange}
            ref={fromInput}
          />
        </label>

        {/* To date field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="start">
          <span>To date:</span>
          <input
            type="date"
            className="input input-bordered w-full"
            id="to_date"
            name="to_date"
            value={to_date}
            onChange={handleChange}
            ref={toInput}
          />
        </label>

        {/* Cancel search button */}
        <button onClick={handleCancelButton} className="btn btn-outline" type="button">Cancel search</button>
      </form>

      {/* Display alert if there was an issue deleting an event */}
      {
        errors.delete &&
        <div className="alert alert-warning w-3/4 inline-block m-4 justify-center text-center">
          <InfoCircle size="32" className="inline-block" /><p>{errors.delete}</p>
        </div>
      }

      {/* Display events using search results */}
      {
        hasLoaded ? (
          <div className="max-h-96 overflow-scroll">
            {
              events?.results?.map((event, i) => {
                // We pass didSaveEvent and setDidSaveEvent through to the CalEvent so that it in turn can pass them to its children if the user edits an event
                return <CalEvent
                  event={event}
                  key={`event-${event.id}-${i}`}
                  didSaveEvent={didSaveEvent}
                  setDidSaveEvent={setDidSaveEvent}
                  handleDeleteButton={handleDeleteButton}
                />
              })
            }
          </div>
        ) : (
          <Spinner />
        )
      }


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

    </div>
  )
}

export default EventSearch