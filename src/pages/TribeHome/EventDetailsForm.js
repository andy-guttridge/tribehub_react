import React, { useEffect, useState } from 'react';
import { InfoCircle } from 'react-bootstrap-icons';
import { axiosReq } from '../../api/axiosDefaults';
import Spinner from '../../components/Spinner';

import { eventCategories } from '../../utils/constants';

function EventDetailsForm({ handleNewEventButton, didSaveEvent, setDidSaveEvent }) {

  // State variables for loading status and tribe members data
  const [hasLoaded, setHasLoaded] = useState(false);
  const [tribe, setTribe] = useState({ results: [] });

  // State variables for form submission errors
  const [errors, setErrors] = useState({});

  // State variables for calendar events
  const [calEvent, setCalEvent] = useState({
    to: [''],
    start: '',
    duration: '00:30:00',
    recurrence_type: 'NON',
    subject: '',
    category: 'OTH'
  });

  // Retrieve form data from state variables
  const { to, start, duration, recurrence_type, subject, category } = calEvent;

  // Change handler for event form (excepting the multiple selection input for inviting users)
  const handleChange = (event) => {
    setCalEvent({
      ...calEvent,
      [event.target.name]: event.target.value
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosReq.post('/events/', calEvent);

      // Hide form and tell parent component the event was saved
      handleNewEventButton();
      setDidSaveEvent(!didSaveEvent);
    }
    catch (error) {
      console.log('Setting error: ', error)
      setErrors(error.response?.data);
    }
  }

  // Retrieve this user's tribe members from the API
  useEffect(() => {
    const fetchTribe = async () => {
      try {
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

  return (
    <div className="basis-full">
      <h3>Add a calendar event</h3>

      {hasLoaded ? (

        // Add event form 
        <form onSubmit={handleSubmit}>

          {/* To users field */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="to">
            <span>To:</span>
            <select
              id="to"
              name="to"
              value={to}
              onChange={handleChangeTo}
              multiple={true}
            >
              {
                tribe?.results[0]?.users?.map((tribeMember) => {
                  return <option value={tribeMember.user_id} key={`tribe-${tribeMember.user_id}`}>{tribeMember.display_name}</option>
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

          <button className="btn btn-outline m-2}" type="button" onClick={handleNewEventButton}>Cancel</button>
          <button className="btn btn-outline w-1/3 m-2" type="submit">Submit</button>

          {/* Display alert with any non-field errors */}
          {
            errors.non_field_errors?.map((error) => (
              <div className="alert alert-warning justify-start mt-4">
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

    </div>
  )
}

export default EventDetailsForm