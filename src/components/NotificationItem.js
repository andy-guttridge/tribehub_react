import React, { useEffect, useState } from 'react'
import { Trash3 } from 'react-bootstrap-icons';
import { axiosReq } from '../api/axiosDefaults';
import { useCurrentUser } from '../contexts/CurrentUserContext';

function NotificationItem({ notification, notificationsChanged, setNotificationsChanged, handleDeleteButton }) {

  // State variables for strings representing event start and end dates and times
  const [startDateStr, setStartDateStr] = useState('');
  const [startTimeStr, setStartTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');

  // State variable for whether user has accepted the invitation
  const [hasAccepted, setHasAccepted] = useState('false');

  // State variable for errors
  const [errors, setErrors] = useState({})

  // Reference to current user
  const currentUser = useCurrentUser();

  // Handle event accept/decline buttons
  const handleEventResponse = async (e) => {

    // Create response object from value of button, attempt to post and set state variable
    const eventResponse = { event_response: e.target.value }
    try {
      await axiosReq.post(`/events/response/${notification?.event?.id}/`, eventResponse);
      setHasAccepted(e.target.value === 'accept');

      // Communicate to the parent that the status of the notification changed
      setNotificationsChanged(!notificationsChanged);
    }
    catch (error) {
      setErrors({ event_response: 'There was an error processing your response to this event. You may be offline, or there may have been a server error.' })
    }
  }

  useEffect(() => {

    // Check if this user has accepted the invitation by comparing to each user in the event.accepted field in turn
    const checkAccepted = () => (notification?.event?.accepted?.reduce(
      (acc, user) => (user.user_id === currentUser.pk) || acc
      ,
      false))

    const hasAcceptedData = checkAccepted();
    setHasAccepted(hasAcceptedData);

    const eventDate = new Date(notification?.event?.start);

    // Extract date and time strings for start date
    setStartDateStr(eventDate.toDateString('en-UK', { dateStyle: 'short' }));
    setStartTimeStr(eventDate.toLocaleTimeString('en-UK', { timeStyle: 'short' }));

    // Calculate end date from duration
    // Split duration string into array of hours, mins, secs and convert to array of ints
    const hoursMinsSecsStr = notification?.event?.duration.split(":");
    const hoursMinsSecs = hoursMinsSecsStr.map((str) => parseInt(str));

    // Convert hours, mins and secs to milliseconds, calculate end date and format for display
    const durationMilliSecs = (hoursMinsSecs[1] * 60) * 1000 + (hoursMinsSecs[0] * 60 * 60 * 1000);
    const endDate = new Date(notification?.event?.start);
    endDate.setTime(endDate.getTime() + durationMilliSecs);

    // Extract date and time strings for end date
    setEndDateStr(endDate.toDateString('en-UK', { dateStyle: 'short' }))
    setEndTimeStr(endDate.toLocaleTimeString('en-UK', { timeStyle: 'short' }));

  }, [])

  return (

    // Return a list item representing the notification
    <li>
      <div className="inline">
        <h3 className="text-base text-center">{notification.subject}</h3>
        <p className="text-sm text-center">{notification.message}</p>
        <p className="text-sm text-left"><span>Start: </span><br /><span>{startDateStr} {startTimeStr}</span></p>
        <p className="text-sm text-left"><span>End: </span><br /><span>{endDateStr} {endTimeStr}</span></p>

        {/* Check this notification is for an event and show going/not going buttons if so. Also a delete button */}
        {/* Currently this is the only type of notification, but others could be added in future */}
        {
          notification.type = "INV" &&
          <div className="btn-group justify-center">
            <button
              className={"btn btn-xs " + (!hasAccepted && "btn-active")}
              name='not-going'
              id='not-going'
              value='decline'
              onClick={handleEventResponse}
            >
              Not going
            </button>
            <button
              className={"btn btn-xs " + (hasAccepted && "btn-active")}
              name='not-going'
              id='not-going'
              value='accept'
              onClick={handleEventResponse}
            >
              Going
            </button>
            <button className="btn btn-xs btn-outline" onClick={() => handleDeleteButton(notification.id)}>
              <Trash3 size="16" />
              <span className="sr-only">Delete notification</span>
            </button>
          </div>
        }
        <br /><br /><hr />
      </div>
    </li>
  )
}

export default NotificationItem