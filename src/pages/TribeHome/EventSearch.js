import React, { useEffect, useRef, useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons';
import ReactDOM from 'react-dom'

import { axiosReq } from '../../api/axiosDefaults';
import ConfirmModal from '../../components/ConfirmModal';
import Spinner from '../../components/Spinner';
import { eventCategories } from '../../utils/constants';
import CalEvent from './CalEvent';
import css from '../../styles/EventSearch.module.css';
import { useSinglePage } from '../../contexts/SinglePageContext';

/**
 * Search form and results for events
 * @component
 * @param {object} obj Props
 * @param {function} obj.handleCancelButton Handler for cancel button
 * @param {function} obj.setActionSucceeded Sets a success message when a request resulting in a change to data succeeds
 */
function EventSearch({ handleCancelButton, setActionSucceeded }) {
  // State for user's tribe members
  const [tribe, setTribe] = useState({ results: [] });

  // Check if running in single page mode
  const singlePage = useSinglePage();

  // Errors
  const [errors, setErrors] = useState({});

  // State for if data has loaded
  const [hasLoaded, setHasLoaded] = useState(false);

  // Toggle to trigger data refresh when event details are saved.
  const [didSaveEvent, setDidSaveEvent] = useState(false)

  // State for whether user is in the process of deleting an event. id of the event is stored here if so.
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

  // State for search form values
  const [searchValues, setSearchValues] = useState({
    text_search: '',
    category_search: '',
    tribe_to: [],
    tribe_from: '',
    from_date: undefined,
    to_date: undefined
  })

  const { text_search, category_search, tribe_to, tribe_from, to_date, from_date } = searchValues;

  // State for events
  const [events, setEvents] = useState({ results: [] })

  // Refs to from and to date form fields
  const fromInput = useRef(null);
  const toInput = useRef(null);

  useEffect(() => {
    /**
     * Fetch user's tribe members
     */
    const fetchTribe = async () => {
      try {
        setHasLoaded(false);
        const { data } = await axiosReq.get('tribe/');
        setTribe(data);
        setHasLoaded(true);
        setErrors({});
      } catch (error) {
        if (error.response?.status !== 401) {
          setErrors({ tribe: 'There was an error loading tribe data. You may be offline, or there may have been a server error' })
        }
      }
    }
    fetchTribe();
  }, [])

  useEffect(() => {
    /**
     * Fetch events according to search values
     */

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

    const fetchEvents = async () => {
      /**
       * Fetch events from the API
       */
      try {
        const { data } = await axiosReq.get(`events/${finalSearchString}`);
        setEvents(data);
        setHasLoaded(true);
        setErrors({});
      } catch (error) {
        if (error.response?.status !== 401) {
          setErrors({ events: 'There was an error loading search results. You may be offline, or there may have been a server error.' });
        }
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
  }, [category_search, from_date, tribe_from, text_search, to_date, tribe_to, didSaveEvent])

  const handleDeleteButton = (eventId) => {
    /** 
     * Handle event delete button. Store id of event to be deleted 
     */
    setIsDeletingEvent(eventId);
  }

  const handleChange = (e) => {
    /**
     * Handle change to search form field values (except multipe selection fields)
     */
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

  const handleMultipleSelectChange = (e) => {
    /**
     * Change handler for multiple selection form fields
     * Code to handle multiple selections in controlled React forms is from
     * https://stackoverflow.com/questions/50090335/how-handle-multiple-select-form-in-reactjs
     */

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

  const doDelete = async () => {
    /**
     * Handle user confirmation of event deletion
     */
    try {
      await axiosReq.delete(`events/${isDeletingEvent}/`);
      setDidSaveEvent(!didSaveEvent);
      setErrors({});
      setActionSucceeded('The event has now been deleted');
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors({ delete: 'There was an error deleting this calendar event.\n\n You may be offline or there may have been a server error.' })
      }
    }
    setIsDeletingEvent(false);
  }

  return (
    <section className={`basis-full md:mx-2 ${css.EventSearchExpand}`}>
      <h3>Search events</h3>

      {/* Display alert if there was an issue fetching tribe data */}
      {
        errors.tribe &&
        <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
          <div>
            <InfoCircle size="32" />
          </div>
          <div>
            <p>{errors.tribe}</p>
          </div>
        </div>
      }

      {/* Display alert if there was an issue fetching events data */}
      {
        errors.events &&
        <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
          <div>
            <InfoCircle size="32" />
          </div>
          <div>
            <p>{errors.events}</p>
          </div>
        </div>
      }

      {
        hasLoaded ? (
          <form className="w-4/5 m-auto mb-2 md:w-full">

            {/* Text search field */}
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="text_search">
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
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="category_search">
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
            <p className="text-left text-sm md:text-center hidden lg:inline">Hold own Ctrl (Windows) or Cmd (Mac) to make multiple selections</p>
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="tribe_to">
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
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="tribe_from">
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
            <p className='text-sm text-left md:text-center'>{`You'll get events for the next two months if you don't enter dates`}</p>
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="from_date">
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
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="to_date">
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
            <button onClick={handleCancelButton} className="btn btn-outline" type="button" id="event-search-cancel-btn">Cancel search</button>
          </form>
        ) : (
          <Spinner />
        )
      }

      {/* Display alert if there was an issue deleting an event */}
      {
        errors.delete &&
        <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
          <div>
            <InfoCircle size="32" />
          </div>
          <div>
            <p>{errors.delete}</p>
          </div>
        </div>
      }

      {/* Display events using search results */}
      {
        <div className="bg-base-200">
          <div className="md:max-h-96 md:overflow-scroll md:border md:border-base-200 w-full">
            {
              events?.results?.map((event, i) => {
                // Pass didSaveEvent and setDidSaveEvent through to the CalEvent so that it in turn can pass them to its children if the user edits an event
                return <CalEvent
                  event={event}
                  key={`event-${event.id}-${i}`}
                  calEventId={`event-${event.id}-${i}`}
                  didSaveEvent={didSaveEvent}
                  setDidSaveEvent={setDidSaveEvent}
                  handleDeleteButton={handleDeleteButton}
                  setActionSucceeded={setActionSucceeded}
                />
              })
            }
          </div>
        </div>
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

      {
        // Empty div with margin to provide clearance above bottom navbar if not in single page mode
        !singlePage && <div className="mb-4 bg-base-100"><br /></div>
      }

    </section>
  )
}

export default EventSearch