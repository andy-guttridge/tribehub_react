import React, { useEffect, useState } from 'react';
import { InfoCircle } from 'react-bootstrap-icons';

import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import Spinner from '../../components/Spinner';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { eventCategories } from '../../utils/constants';

function EventDetailsForm({ handleCancelButton, didSaveEvent, setDidSaveEvent, isEditingEvent, event, defaultStartDate }) {

  // State variables for loading status and tribe members data
  const [hasLoaded, setHasLoaded] = useState(false);
  const [tribe, setTribe] = useState({ results: [] });

  // State variables for form submission errors
  const [errors, setErrors] = useState({});

  // Ref to current user
  const currentUser = useCurrentUser();

  // State variables for calendar events
  const [calEvent, setCalEvent] = useState({
    to: [''],
    start: defaultStartDate,
    duration: '00:30:00',
    recurrence_type: 'NON',
    subject: '',
    category: 'OTH'
  });

  // Retrieve form data from state variables
  const { to, start, duration, recurrence_type, subject, category } = calEvent;

  // Change handler for event form (excepting the multiple selection input for inviting users)
  const handleChange = (e) => {
    setCalEvent({
      ...calEvent,
      [e.target.name]: e.target.value
    })
  }

  // Change handler for 'to' multiple selection form field
  // Code to handle multiple selections in controlled React forms is from
  // https://stackoverflow.com/questions/50090335/how-handle-multiple-select-form-in-reactjs
  const handleChangeTo = (event) => {

    // Get full array of options from click event, and map over them
    // to find out if they are selected - if so, add to array
    const options = Array.from(event.target.options);
    const toFieldValue = [];
    options.map((option) => {
      option.selected && toFieldValue.push(option.value)
    })

    // Set value of the form element using the array
    setCalEvent({
      ...calEvent,
      to: toFieldValue
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      // If user is editing event, try put request, otherwise try post request
      if (isEditingEvent) {
        const formData = new FormData();

        // Manually create and append form data to replicate the format of the axios post request, as the API expects this
        for (let user of calEvent.to) {
          formData.append('to[]', user)
        }
        formData.append('start', calEvent.start);
        formData.append('duration', calEvent.duration);
        formData.append('recurrence_type', calEvent.recurrence_type);
        formData.append('subject', calEvent.subject);
        formData.append('category', calEvent.category);
        await axiosReq.put(`/events/${event.id}/`, formData)

        // Hide form and tell parent component the event was saved
        handleCancelButton();
        setDidSaveEvent(!didSaveEvent);
      }
      else {
        await axiosReq.post('/events/', calEvent);

        // Hide form and tell parent component the event was saved
        handleCancelButton();
        setDidSaveEvent(!didSaveEvent);
      }
    }
    catch (error) {
      setErrors(error.response?.data);
    }

  }


  // Retrieve this user's tribe members from the API and fetch the original event if user is editing a recurrence.
  // Populate form with existing event details if applicable.
  useEffect(() => {
    const fetchTribe = async () => {
      try {
        const { data } = await axiosRes.get('tribe/');
        setTribe(data);
        setHasLoaded(true);
      }
      catch (error) {
        setErrors({ tribe: 'There was an error loading tribe data from the server.' })
      }
    }
    fetchTribe();

    if (isEditingEvent) {

      // If user is editing a recurrence, then we need to fetch the original and use that
      // to populate the form. Otherwise, we have an original event already, so just use that data.
      const fetchEvent = async () => {
        if (event.recurrence_type === 'REC') {
          try {
            setHasLoaded(false);
            const { data } = await axiosRes.get(`/events/${event.id}/`);

            // Extract user ids from event data if users have been invited
            let toUsersArray = ['']
            toUsersArray = data.to?.map((toUser) => toUser.user_id)

            // Set form values to those of existing event if user is editing an existing event
            setCalEvent({
              to: toUsersArray,
              start: data.start,
              duration: data.duration,
              recurrence_type: data.recurrence_type,
              subject: data.subject,
              category: data.category
            })
            setHasLoaded(true);
          }
          catch (error) {
            setErrors({ event: 'There was an error loading event data from the server.' })
          }
        }
        else {
          // Extract user ids from event data if users have been invited
          let toUsersArray = ['']
          toUsersArray = event.to?.map((toUser) => toUser.user_id)

          // Set form values to those of existing event if user is editing an existing event
          setCalEvent({
            to: toUsersArray,
            start: event.start,
            duration: event.duration,
            recurrence_type: event.recurrence_type,
            subject: event.subject,
            category: event.category
          })
        }
      }
      fetchEvent();
    }
  }, [])

  return (
    <div className="basis-full">

      {/* Show appropriate title depending if user is adding new or editing existing event */}
      {isEditingEvent ? (
        <>
          <h3>Edit calendar event</h3>
          {event.recurrence_type === 'REC' && <div className="alert alert-info mb-4">You have selected a repeat event. Your edits will be made to the original event.</div>}
        </>
      ) : (
        <h3>Add a calendar event</h3>
      )}



      {hasLoaded ? (

        // Add event form 
        <form onSubmit={handleSubmit}>

          {/* To users field */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="to">
            <span>To:</span>
            <select
              className="input input-bordered w-full"
              id="to"
              name="to"
              value={to}
              onChange={handleChangeTo}
              multiple={true}
            >
              {
                tribe?.results[0]?.users?.map((tribeMember) => {
                  return currentUser.pk !== tribeMember.user_id && <option value={tribeMember.user_id} key={`tribe-${tribeMember.user_id}`}>{tribeMember.display_name}</option>
                })
              }
            </select>
          </label>

          {/* Display alert with any to field errors */}
          {
            errors.to &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.to}</span>
            </div>
          }

          {/* Start time and date field */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="start">
            <span>Date and time:</span>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              id="start"
              name="start"
              value={start}
              onChange={handleChange}
              required
            />
          </label>

          {/* Display alert with any start field errors */}
          {
            errors.start &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.start}</span>
            </div>
          }
          
          {/* Duration field */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="duration">
            <span>Duration:</span>
            <select
              className="input input-bordered w-full"
              required
              id="duration"
              name="duration"
              value={duration}
              onChange={handleChange}
            >
              <option value="00:15:00">15 minutes</option>
              <option value="00:30:00">30 minutes</option>
              <option value="00:45:00">45 minutes</option>
              <option value="01:00:00">1 hour</option>
              <option value="01:30:00">90 minutes</option>
              <option value="02:00:00">2 hours</option>
              <option value="03:00:00">3 hours</option>
              <option value="04:00:00">4 hours</option>
              <option value="05:00:00">5 hours</option>
              <option value="06:00:00">6 hours</option>
            </select>
          </label>

          {/* Display alert with any duration field errors */}
          {
            errors.duration &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.duration}</span>
            </div>
          }

          {/* Repeat field */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="recurrence_type">
            <span>Repeat:</span>
            <select
              className="input input-bordered w-full"
              id="recurrence_type"
              name="recurrence_type"
              value={recurrence_type}
              onChange={handleChange}
            >
              <option value="NON">None</option>
              <option value="DAI">Daily</option>
              <option value="WEK">Weekly</option>
              <option value="TWK">Two weekly</option>
              <option value="MON">Monthly</option>
              <option value="YEA">Yearly</option>
            </select>
          </label>

          {/* Display alert with any recurrence_type field errors */}
          {
            errors.recurrence_type &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.recurrence_type}</span>
            </div>
          }

          {/* Subject field */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="subject">
            <span>Subject:</span>
            <input
              type="text"
              className="input input-bordered w-full"
              id="subject"
              name="subject"
              value={subject}
              onChange={handleChange}
            />
          </label>

          {/* Display alert with any subject field errors */}
          {
            errors.subject &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.subject}</span>
            </div>
          }

          {/* Category field */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="category">
            <span>Category:</span>

            {/* How to iterate over values of an object in React is from */}
            {/* https://stackoverflow.com/questions/40803828/how-can-i-map-through-an-object-in-reactjs */}
            <select
              className="input input-bordered w-full"
              required
              id="category"
              name="category"
              value={category}
              onChange={handleChange}
            >
              {
                Object.keys(eventCategories).map((keyName) => {
                  return <option value={keyName} key={`category-${keyName}`}>{eventCategories[keyName].text}</option>
                })
              }
            </select>
          </label>

          {/* Display alert with any category field errors */}
          {
            errors.category &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.category}</span>
            </div>
          }
          
          {/* Cancel and submit buttons */}
          <button className="btn btn-outline m-2}" type="button" onClick={handleCancelButton}>Cancel</button>
          <button className="btn btn-outline w-1/3 m-2" type="submit">Submit</button>

          {/* Display alert with any non-field errors */}
          {
            errors.non_field_errors?.map((error, i) => (
              <div className="alert alert-warning justify-start mt-4" key={`eventform-nonfield-err${i}`}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            ))
          }
        </form>


      ) : (
        <Spinner />
      )}

      {/* Display alert if there was an issue loading tribe data */}
      {
        errors.tribe &&
        <div className="alert alert-warning justify-start mt-4">
          <InfoCircle size="32" /><span>{errors.tribe}</span>
        </div>
      }

      {/* Display alert if there was an issue fetching event data */}
      {
        errors.event &&
        <div className="alert alert-warning justify-start mt-4">
          <InfoCircle size="32" /><span>{errors.event}</span>
        </div>
      }

    </div>
  )
}

export default EventDetailsForm