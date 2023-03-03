import React, { useEffect, useState } from 'react'
import { ArrowRepeat, InfoCircle, PencilSquare, Trash3 } from 'react-bootstrap-icons';

import Avatar from '../../components/Avatar'
import { eventCategories } from '../../utils/constants';
import styles from '../../styles/CalEvent.module.css'
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import EventDetailsForm from './EventDetailsForm';
import { axiosReq } from '../../api/axiosDefaults';
import { useSinglePage } from '../../contexts/SinglePageContext';

function CalEvent({ event, didSaveEvent, setDidSaveEvent, handleDeleteButton, calEventId }) {

  // Reference to current user
  const currentUser = useCurrentUser();

  // State variables to flag whether user is currently editing an event
  const [isEditingEvent, setIsEditingEvent] = useState();

  // Single page mode hook
  const singlePage = useSinglePage();

  // State variable for whether more than four users are invited
  const [moreThanFour, setMoreThanFour] = useState(false);

  // State variable for users who need an avatar on the event
  const [avatarUsers, setAvatarUsers] = useState([]);

  // State variable for users who have accepted the invitation
  const [acceptedUserIds, setAcceptedUserIds] = useState([]);

  // State variables for string representations of the event start and end times
  const [eventTimeStr, setEventTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');

  // State variables for string representations of event start and end dates
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');

  // State variables for whether user is invited to the event and whether they have accepted
  const [isInvited, setIsInvited] = useState(false);
  const [hasAccepted, setHasAccepted] = useState('false');

  // State variables for errors
  const [errors, setErrors] = useState({})

  // Handle event accept/decline buttons
  const handleEventResponse = async (e) => {

    // Create response object from value of button, attempt to post and set state variable
    const eventResponse = { event_response: e.target.value }
    try {
      await axiosReq.post(`/events/response/${event.id}/`, eventResponse);
      setHasAccepted(e.target.value === 'accept');

      // If the user has accepted, create an object to represent the user matching
      // the format that comes back from the API and use it to update the current accepted status in the UI
      // (currentUser is in the wrong format). If user has declined, filter them out of the array of accepted users.
      let updatedAcceptArray = [];
      if (e.target.value === 'accept') {
        updatedAcceptArray = [...event.accepted];
        updatedAcceptArray.push({
          user_id: currentUser.pk,
          display_name: currentUser.display_name,
          image: currentUser.profile_image
        })
      } else {
        updatedAcceptArray = [...event.accepted].filter((user) => user.user_id !== currentUser.pk)
      }

      setErrors({});

      // Trigger a reload of the parent as event recurrences may also be affected
      setDidSaveEvent(!didSaveEvent);
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors({ event_response: 'There was an error processing your response to this event. You may be offline, or there may have been a server error.' })
      }
    }
  }

  useEffect(() => {
    // Get list of users invited to this event who need avatars, including the owner and invitees.
    // Set flag if there will be more than four invitees (plus the owner).
    const getUsers = () => {
      const usersNeedAvatars = [];
      usersNeedAvatars.push(event.user);
      setMoreThanFour(event.to.length > 4);
      for (let i = 0; i < event.to.length; i++) {
        if (i > 3) { break; }
        usersNeedAvatars.push(event.to[i])
      }
      setAvatarUsers(usersNeedAvatars);

      // Check if this user is invited by comparing to each user in the event.to field in turn
      const checkInvited = () => (event.to?.reduce(
        (acc, user) => ((user.user_id === currentUser.pk) || acc), false))
      setIsInvited(checkInvited());

      // Check if this user has accepted the invitation by comparing to each user in the event.accepted field in turn
      const checkAccepted = () => (event.accepted?.reduce(
        (acc, user) => ((user.user_id === currentUser.pk) || acc), false))
      setHasAccepted(checkAccepted());
    }
    getUsers();
  }, [currentUser, event])

  useEffect(() => {
    const getTimeStrs = () => {

      // Convert event start date string to an actual date and format for display
      const eventDate = new Date(event.start);
      setEventTimeStr(eventDate.toLocaleTimeString('en-UK', { timeStyle: 'short' }));
      setStartDateStr(eventDate.toDateString('en-UK', { dateStyle: 'short' }));
      // Split duration string into array of hours, mins, secs and convert to array of ints
      const hoursMinsSecsStr = event.duration.split(':');
      const hoursMinsSecs = hoursMinsSecsStr.map((str) => parseInt(str));

      // Convert hours, mins and secs to milliseconds, calculate end date and format for display
      const durationMilliSecs = (hoursMinsSecs[1] * 60) * 1000 + (hoursMinsSecs[0] * 60 * 60 * 1000);
      const endDate = new Date(event.start);
      endDate.setTime(endDate.getTime() + durationMilliSecs);
      setEndTimeStr(endDate.toLocaleTimeString('en-UK', { timeStyle: 'short' }));
      setEndDateStr(eventDate.toDateString('en-UK', { dateStyle: 'short' }));
    }
    getTimeStrs();
  }, [event])

  useEffect(() => {
    const getAcceptedUserIds = () => {
      // Extract user_ids of users who have accepted the invitation and the event owner.
      // Used to decide whether to grey out avatars.
      const Ids = event.accepted.map((user) => user.user_id);
      Ids.push(event.user.user_id);
      setAcceptedUserIds(Ids);
    }
    getAcceptedUserIds();
  }, [hasAccepted, event])


  return (
    <div className="card rounded-md bg-base-100 my-2 lg:mx-2 text-center">

      {/* Display the EventDetailsForm if user is editing an event */}
      {isEditingEvent &&
        <EventDetailsForm
          handleCancelButton={() => setIsEditingEvent(false)}
          isEditingEvent
          event={event}
          setDidSaveEvent={() => setDidSaveEvent(!didSaveEvent)}
        />}
      
      {/* Card title */}
      <div className="card-title bg-base-100 rounded-sm flex justify-between p-2">
        {/* Event category icon */}
        <img
          src={require(`../../assets/categories/${eventCategories[event.category].image}`)}
          className={`w-12 CategoryIcon col-span-1`}
          alt={[eventCategories[event.text]]}
        />
        <div>
        <h4 className={`${singlePage ? "text-xl" : "text-md"}`}>{event.subject}</h4>
        </div>
        

        <div className={`avatar-group ${singlePage ? "-space-x-14" : "-space-x-6"}`}>
    
          {/* Return an avatar for each user */}
          {/* Include a prop to say whether they have accepted the invitation */}
          {
            avatarUsers.map((toUser, i) => {
              return (
                <Avatar
                  small = {singlePage ? false : true}
                  imageUrl={toUser.image}
                  displayName={toUser.display_name}
                  key={`event-to${event.id}-${toUser.user_id}-${i}`}
                  accepted={!(acceptedUserIds.includes(toUser.user_id))}
                />
              )
            })
          }
          {
            // Create a placeholder avatar with the remaining number if there are more than four invitees (plus the owner)
            moreThanFour &&
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                <span className="text-sm">+{event.to.length - 4}</span>
              </div>
            </div>
          }
        </div>
      </div>
      
      <div className="col-span-2 text-center">
          {event.recurrence_type !== 'NON' && <ArrowRepeat size="18" className="inline mr-1"/>}
          <div className="text-right inline-block">
          <span className="font-bold text-sm md:text-md">Start: </span><span className="text-sm md:text-md">{startDateStr} {eventTimeStr}  </span>
          <br className="md:hidden"/>
          <span className="font-bold text-sm md:text-md">End: </span><span className="text-sm md:text-md">{endDateStr} {endTimeStr}</span>
          </div>
        </div>
      {/* Show edit button and delete button if user is owner of this event or tribe admin */}
      <div className="flex justify-end">
        {(event.user.user_id === currentUser.pk || currentUser.is_admin)
          &&
          <>
            <button
              className={`btn btn-ghost ${isEditingEvent && "btn-disabled"}`}
              onClick={() => setIsEditingEvent(true)}
              id={`edit-event-btn-${calEventId}`}
            >
              <PencilSquare size="26" className="text-primary" />
              <span className="sr-only">Edit calender event {event.subject}</span>
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => handleDeleteButton(event.id)}
              id={`delete-event-btn-${calEventId}`}
            >
              <Trash3 size="26" className="text-primary" />
              <span className="sr-only">Delete calender event {event.subject}</span>
            </button>
          </>
        }
      </div>

      {/* Card body */}

      {/* Show going/not going buttons if user is invited */}
      {
        isInvited &&
        <div className="btn-group justify-center">
          <button
            className={"btn btn-sm " + (!hasAccepted && "btn-active")}
            name="not-going"
            id="not-going"
            value="decline"
            onClick={handleEventResponse}
          >
            Not going
          </button>
          <button
            className={"btn btn-sm " + (hasAccepted && "btn-active")}
            name="not-going"
            id="not-going"
            value="accept"
            onClick={handleEventResponse}
          >
            Going
          </button>
        </div>
        /* Display alert if there was an issue loading tribe data */}
      {
        errors.event_response &&
        <div className="alert alert-warning justify-start mt-4">
          <InfoCircle size="32" /><span>{errors.event_response}</span>
        </div>
      }

      {/* Collapse section for more detail */}
      <div className="collapse collapse-arrow p-0">
        <label htmlFor={calEventId} className="sr-only">Dropdown button for more detail</label>
        <input type="checkbox" id={calEventId}/>
        <div className="collapse-title text-right">Detail</div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center">
            <div>

              {/* Retrieve and display the event w */}
              <h5>
                From:
              </h5>
              <div className={`${styles.User} m-2 inline-block bg-secondary`}><span className="text-secondary-content font-bold">{event.user.display_name}</span></div>
            </div>

            <div>

              {/* Retrieve and display the users invited */}
              <h5>To:</h5>
              {event.to?.map((user, i) => {
                return (
                  <div className={`${styles.User} m-2 inline-block bg-secondary`} key={`${user.user_id}-${i}`}><span className="text-secondary-content font-bold">{user.display_name}</span></div>
                )
              })}
            </div>

            <div>

              {/* Retrieve and display the users who have accepted */}
              <h5>Accepted:</h5>
              {event.accepted?.map((user, j) => {
                return (
                  <div className={`${styles.User} inline-block bg-secondary`} key={`${user.user_id}-${j}-acc`}><span className="text-secondary-content font-bold">{user.display_name}</span></div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalEvent