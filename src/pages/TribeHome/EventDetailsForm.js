import React, { useEffect, useState } from 'react';
import { InfoCircle } from 'react-bootstrap-icons';

import { axiosReq } from '../../api/axiosDefaults';
import Spinner from '../../components/Spinner';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { eventCategories } from '../../utils/constants';
import css from '../../styles/EventDetailsForm.module.css'

/**
 * Form for adding new and editing existing events
 * @component
 * @param {object} obj Props
 * @param {function} obj.handleCancelButton Handler for cancel button
 * @param {boolean} obj.didSaveContact Toggle to tell parent an event was saved
 * @param {function} obj.setDidSaveEvent Set didSaveContact
 * @param {boolean} obj.isEditingEvent If true, user is editing an existing event
 * @param {object} obj.event The event to be edited, if user is editing
 * @param {date} obj.defaultStartDate The default start date for the edit event form
 * @param {function} obj.setActionSucceeded Set string for success message when data has been changed
 */
function EventDetailsForm({ handleCancelButton, didSaveEvent, setDidSaveEvent, isEditingEvent, event, defaultStartDate, setActionSucceeded }) {
  // State for loading status and tribe members data
  const [hasLoaded, setHasLoaded] = useState(false);
  const [tribe, setTribe] = useState({ results: [] });

  // Errors
  const [errors, setErrors] = useState({});

  // Current user
  const currentUser = useCurrentUser();

  // State for calendar events
  const [calEvent, setCalEvent] = useState({
    to: [''],
    start: defaultStartDate,
    duration: '00:30:00',
    recurrence_type: 'NON',
    subject: '',
    category: 'OTH'
  });
  const { to, start, duration, recurrence_type, subject, category } = calEvent;

  const handleChange = (e) => {
    /**
     *   Handle change for event form (excepting the multiple selection input for inviting users)
     */
    setCalEvent({
      ...calEvent,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeTo = (event) => {
    /**
     * Change handler for 'to' multiple selection form field
     * Code to handle multiple selections in controlled React forms is from
     * https://stackoverflow.com/questions/50090335/how-handle-multiple-select-form-in-reactjs
     */

    // Get full array of options from click event, and map over them
    // to find out if they are selected - if so, add to array
    const options = Array.from(event.target.options);
    const toFieldValue = [];
    options.map((option) => {
      return option.selected && toFieldValue.push(option.value)
    })

    // Set value of the form element using the array
    setCalEvent({
      ...calEvent,
      to: toFieldValue
    })
  }

  const handleSubmit = async (e) => {
    /**
     * Handle form submission
     */
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
        setActionSucceeded('Your changes to the event have been saved');
      }
      else {
        await axiosReq.post('/events/', calEvent);

        // Hide form, tell parent component the event was saved and set success message
        handleCancelButton();
        setDidSaveEvent(!didSaveEvent);
        setActionSucceeded('Your event has been added to the calendar')
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }

  }

  useEffect(() => {
    /**
     * Retrieve user's tribe members from the API and fetch the original event if user is editing a recurrence.
     * Populate form with existing event details if applicable.
     */
    const fetchTribe = async () => {
      try {
        const { data } = await axiosReq.get('tribe/');
        setTribe(data);
        setHasLoaded(true);
      } catch (error) {
        if (error.response?.status !== 401) {
          setErrors({ tribe: 'There was an error loading tribe data from the server.' })
        }
      }
    }
    fetchTribe();

    if (isEditingEvent) {

      // If user is editing a recurrence, fetch the original event and use that
      // to populate form. Otherwise, we have an original event already, so just use that data.
      const fetchEvent = async () => {
        if (event.recurrence_type === 'REC') {
          try {
            setHasLoaded(false);
            const { data } = await axiosReq.get(`/events/${event.id}/`);

            // Extract user ids from event if users have been invited
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
          } catch (error) {
            if (error.response?.status !== 401) {
              setErrors({ event: 'There was an error loading event data from the server.' })
            }
          }
        } else {
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
  }, [event, isEditingEvent])

  return (
    <section className={`w-full m-auto md:mx-2 ${css.EventDetailsExpand}`}>

      {/* Show appropriate title depending if user is adding new or editing existing event */}
      {isEditingEvent ? (
        <div className="mx-2 md:mx-0">
          <h3>Edit calendar event</h3>
          {event.recurrence_type === 'REC' && <div className="alert alert-info mb-4">You have selected a repeat event. Your edits will be made to the original event.</div>}
        </div>
      ) : (
        <h3>Add a calendar event</h3>
      )}

      {hasLoaded ? (

        // Add/edit event form 
        <form onSubmit={handleSubmit} className="w-4/5 m-auto md:w-full">

          {/* To users field */}
          <p className="text-left text-sm md:text-center hidden lg:inline">Hold own Ctrl (Windows) or Cmd (Mac) to make multiple selections</p>
          <label className="text-sm input-group max-lg:input-group-vertical mb-4" htmlFor="to">
            <span>To:</span>
            <select
              className="input input-bordered w-full"
              id="to"
              name="to"
              value={to}
              onChange={handleChangeTo}
              multiple={true}
            >

              {/* Add each tribe member to the options for the drop-down, except for the current user */}
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
            <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
              <div>
                <InfoCircle size="32" />
              </div>
              <div>
                <p>{errors.to}</p>
              </div>
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
            <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
              <div>
                <InfoCircle size="32" />
              </div>
              <div>
                <p>{errors.start}</p>
              </div>
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
            <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
              <div>
                <InfoCircle size="32" />
              </div>
              <div>
                <p>{errors.duration}</p>
              </div>
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
            <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
              <div>
                <InfoCircle size="32" />
              </div>
              <div>
                <p>{errors.recurrence_type}</p>
              </div>
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
              maxLength="100"
            />
          </label>

          {/* Display alert with any subject field errors */}
          {
            errors.subject &&
            <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
              <div>
                <InfoCircle size="32" />
              </div>
              <div>
                <p>{errors.subject}</p>
              </div>
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
            <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
              <div>
                <InfoCircle size="32" />
              </div>
              <div>
                <p>{errors.category}</p>
              </div>
            </div>
          }

          {/* Cancel and submit buttons */}
          <button className="btn btn-outline m-2}" type="button" onClick={handleCancelButton} id="event-details-cancel-btn">Cancel</button>
          <button className="btn btn-primary w-1/3 m-2" type="submit" id="event-details-submit-btn">Submit</button>

          {/* Display alert with any non-field errors */}
          {
            errors.non_field_errors?.map((error, i) => (
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`eventform-nonfield-err${i}`}>
                <div>
                  <InfoCircle size="32" />
                </div>
                <div>
                  <p>{error}</p>
                </div>
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
        <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
          <div>
            <InfoCircle size="32" />
          </div>
          <div>
            <p>{errors.tribe}</p>
          </div>
        </div>
      }

      {/* Display alert if there was an issue fetching event data */}
      {
        errors.event &&
        <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
          <div>
            <InfoCircle size="32" />
          </div>
          <div>
            <p>{errors.event}</p>
          </div>
        </div>
      }

    </section>
  )
}

export default EventDetailsForm