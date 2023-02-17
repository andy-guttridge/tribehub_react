import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { axiosReq } from '../../api/axiosDefaults';
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

  // State variables for whether user is in the process of deleting an event
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

  // State variables for search values
  const [searchValues, setSearchValues] = useState({
    text_search: '',
    category_search: '',
    tribe_search: []
  })

  // Retrieve search values from state variables
  const { text_search, category_search, tribe_search } = searchValues;

  // State variables for events
  const [events, setEvents] = useState({ results: [] })
  
  // Fetch user's tribe members
  useEffect(() => {
    const fetchTribe = async () => {
      try {
        setHasLoaded(false);
        const { data } = await axiosReq.get('tribe/');
        setTribe(data);
        setHasLoaded(true);
      }
      catch (error) {
        setErrors({ tribe: 'There was an error loading tribe data from the server.' })
      }
    }
    fetchTribe();
  }, [])

  // Fetch events according to search values
  useEffect(() => {

    // Create URL parameter strings for text_search and the category and tribe search arrays, then concatenate them
    const textSearch = `?search=${text_search}`;
    const categorySearch = category_search ? `&category=${category_search}` : '';
    const tribeSearch = tribe_search.reduce((acc, tribeMember) => acc + `&to=${tribeMember}`, '');
    const finalSearchString = textSearch.concat(categorySearch, tribeSearch)
    
    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        setHasLoaded(false);
        const { data } = await axiosReq.get(`events/${finalSearchString}`);
        console.log(data.results);
        setEvents(data);
        setHasLoaded(true);
      }
      catch (errors) {
        setErrors(errors);
      }
    }
    fetchEvents();
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
      option.selected && searchValue.push(option.value)
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
    }
    catch (error) {
      setErrors({ delete: 'There was an error deleting this calendar event.\n\n You may be offline or there may have been a server error.' })
    }
    setIsDeletingEvent(false);
  }

  return (
    <div className="basis-full">
      <h3>Search events</h3>
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
          <span>Tribe member search:</span>
          <select
            className="input input-bordered w-full"
            id="tribe_search"
            name="tribe_search"
            value={tribe_search}
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

        <button onClick={handleCancelButton} className="btn btn-outline">Cancel search</button>
      </form>

      {/* Display events using search results */}
      {
        hasLoaded ? (
          <div className="max-h-96 inline-block overflow-scroll">
            {
              events?.results?.map((event, i) => {
                // We pass didSaveEvent and setDidSaveEvent through to the CalEvent so that it in turn can pass them to its children if the user edits an event
                return <CalEvent event={event} key={`event-${event.id}-${i}`} didSaveEvent={didSaveEvent} setDidSaveEvent={setDidSaveEvent} handleDeleteButton={handleDeleteButton} />
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