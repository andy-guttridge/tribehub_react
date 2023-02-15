import React, { useEffect, useState } from 'react'
import { ArrowRepeat, InfoCircle, PencilSquare, Trash3 } from 'react-bootstrap-icons';

import Avatar from '../../components/Avatar'
import { eventCategories } from '../../utils/constants';
import styles from '../../styles/CalEvent.module.css'
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import EventDetailsForm from './EventDetailsForm';
import { axiosReq } from '../../api/axiosDefaults';

function CalEvent({ event, didSaveEvent, setDidSaveEvent, handleDeleteButton }) {

  // Reference to current user
  const currentUser = useCurrentUser();

  // State variables for the event represented by this component
  const [thisEvent, setThisEvent] = useState(event);

  // State variables to flag whether user is currently editing an event
  const [isEditingEvent, setIsEditingEvent] = useState();

  // State variable for whether more than four users are invited
  const [moreThanFour, setMoreThanFour] = useState(false);

  // State variable for users who need an avatar on the event
  const [avatarUsers, setAvatarUsers] = useState([]);

  // State variable for users who have accepted the invitation
  const [acceptedUserIds, setAcceptedUserIds] = useState([]);

  // State variables for string representations of the event start and end times
  const [eventTimeStr, setEventTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');

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
      await axiosReq.post(`/events/response/${thisEvent.id}/`, eventResponse);
      setHasAccepted(e.target.value === 'accept');

      // If the user has accepted, create an object to represent the user matching
      // the format that comes back from the API and use it to update the current accepted status in the UI
      // (currentUser is in the wrong format). If user has declined, filter them out of the array of accepted users.
      let updatedAcceptArray = [];
      if (e.target.value === 'accept') {
        updatedAcceptArray = [...thisEvent.accepted];
        updatedAcceptArray.push({
          user_id: currentUser.pk,
          display_name: currentUser.display_name,
          image: currentUser.profile_image
        })
      } else {
        updatedAcceptArray = [...thisEvent.accepted].filter((user) => user.user_id !== currentUser.pk)
      }

      setThisEvent(
        {
          ...thisEvent,
          accepted: updatedAcceptArray
        }
      )

      setErrors({});
    }
    catch (error) {
      setErrors({ event_response: 'There was an error processing your response to this event. You may be offline, or there may have been a server error.' })
    }
  }

  useEffect(() => {
    // Get list of users invited to this event who need avatars, including the owner and invitees.
    // Set flag if there will be more than four invitees (plus the owner).
    const getUsers = () => {
      const usersNeedAvatars = [];
      usersNeedAvatars.push(thisEvent.user);
      setMoreThanFour(thisEvent.to.length > 4);
      for (let i = 0; i < thisEvent.to.length; i++) {
        if (i > 3) { break; }
        usersNeedAvatars.push(thisEvent.to[i])
      }
      setAvatarUsers(usersNeedAvatars);

      // Check if this user is invited by comparing to each user in the event.to field in turn
      const checkInvited = () => (thisEvent.to?.reduce(
        (acc, user) => ((user.user_id === currentUser.pk) || acc), false))
      setIsInvited(checkInvited());

      // Check if this user has accepted the invitation by comparing to each user in the event.accepted field in turn
      const checkAccepted = () => (thisEvent.accepted?.reduce(
        (acc, user) => ((user.user_id === currentUser.pk) || acc), false))
      setHasAccepted(checkAccepted());
    }
    getUsers();
  }, [])

  useEffect(() => {
    const getTimeStrs = () => {
      // Convert event start date string to an actual date and format for display
      const eventDate = new Date(thisEvent.start);
      setEventTimeStr(eventDate.toLocaleTimeString('en-UK', { timeStyle: 'short' }));

      // Split duration string into array of hours, mins, secs and convert to array of ints
      const hoursMinsSecsStr = thisEvent.duration.split(":");
      const hoursMinsSecs = hoursMinsSecsStr.map((str) => parseInt(str));

      // Convert hours, mins and secs to milliseconds, calculate end date and format for display
      const durationMilliSecs = (hoursMinsSecs[1] * 60) * 1000 + (hoursMinsSecs[0] * 60 * 60 * 1000);
      const endDate = new Date(thisEvent.start);
      endDate.setTime(endDate.getTime() + durationMilliSecs);
      setEndTimeStr(endDate.toLocaleTimeString('en-UK', { timeStyle: 'short' }));
    }
    getTimeStrs();
  }, [])

  useEffect(() => {
    const getAcceptedUserIds = () => {
      // Extract user_ids of users who have accepted the invitation and the event owner.
      // Used to decide whether to grey out avatars.
      const Ids = thisEvent.accepted.map((user) => user.user_id);
      Ids.push(thisEvent.user.user_id);
      setAcceptedUserIds(Ids);
    }
    getAcceptedUserIds();
  }, [hasAccepted])


  return (
    <div className="card border-b-2 rounded-sm m-2 text-center">

      {/* Card title */}
      <div className="card-title flex justify-between">
        <h4 className="text-sm">{thisEvent.subject}{thisEvent.recurrence_type !== 'NON' && <ArrowRepeat size="16" />}</h4>
        <div className="avatar-group -space-x-6">

          {/* Return an avatar for each user */}
          {/* Include a prop to say whether they have accepted the invitation */}
          {
            avatarUsers.map((toUser) => {
              return (
                <Avatar
                  small
                  imageUrl={toUser.image}
                  key={`event-to${thisEvent.id}-${toUser.user_id}`}
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
                <span className="text-sm">+{thisEvent.to.length - 4}</span>
              </div>
            </div>
          }
        </div>
      </div>

      {/* Show edit button and delete button if user is owner of this event or tribe admin */}
      <div className="flex justify-start">
        {(thisEvent.user.user_id === currentUser.pk || currentUser.is_admin)
          &&
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setIsEditingEvent(true)}
            >
              <PencilSquare size="26" />
              <span className="sr-only">Edit calender event {thisEvent.subject}</span>
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => handleDeleteButton(thisEvent.id)}
            >
              <Trash3 size="26" />
              <span className="sr-only">Delete calender event {thisEvent.subject}</span>
            </button>
          </>
        }
      </div>

      {/* Card body */}
      <div className="card-body grid grid-cols-2">
        {/* Event category icon */}
        <img src={require(`../../assets/categories/${eventCategories[event.category].image}`)} className={`w-12 ${styles.CategoryIcon}`} />
        <span>{eventTimeStr} - {endTimeStr}</span>
      </div>

      {/* Show going/not going buttons if user is invited */}
      {
        isInvited &&
        <div className="btn-group justify-center">
          <button
            className={"btn btn-sm " + (!hasAccepted && "btn-active")}
            name='not-going'
            id='not-going'
            value='decline'
            onClick={handleEventResponse}
          >
            Not going
          </button>
          <button
            className={"btn btn-sm " + (hasAccepted && "btn-active")}
            name='not-going'
            id='not-going'
            value='accept'
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

      {/* Display the EventDetailsForm if user is editing an event */}
      {isEditingEvent &&
        <EventDetailsForm
          handleCancelButton={() => setIsEditingEvent(false)}
          isEditingEvent
          event={thisEvent}
          setDidSaveEvent={() => setDidSaveEvent(!didSaveEvent)}
        />}

      {/* Collapse section for more detail */}
      <div className="collapse collapse-arrow">
        <input type="checkbox" />
        <div className="collapse-title text-right">Detail</div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center">
            <div>
              {/* Retrieve and display the event w */}
              <h5>
                From:
              </h5>
              <span className={`${styles.User} m-2`}>{thisEvent.user.display_name} </span>
            </div>

            <div>
              {/* Retrieve and display the users invited */}
              <h5>To:</h5>
              {thisEvent.to?.map((user, i) => {
                return (
                  <span className={`${styles.User} m-2`} key={`${user.user_id}-${i}`}>{user.display_name} </span>
                )
              })}
            </div>

            <div>
              {/* Retrieve and display the users who have accepted */}
              <h5>Accepted:</h5>
              {thisEvent.accepted?.map((user, j) => {
                return (
                  <span className={`${styles.User}`} key={`${user.user_id}-${j}-acc`}>{user.display_name} </span>
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