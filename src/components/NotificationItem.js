import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { InfoCircle, Trash3 } from 'react-bootstrap-icons';
import { axiosReq } from '../api/axiosDefaults';
import { useCurrentUser } from '../contexts/CurrentUserContext';

/**
  * Notification item that appears in the notifications dropdown menu
  * @component
  * @param {object} obj
  * @param {object} obj.notification The notification to be displayed
  * @param {boolean} obj.notificationsChanged Boolean which is toggled to let the parent know a notification has changed state
  * @param {function} obj.setNotificationsChanged Setter for notificationsChanged value
  * @param {function} obj.handleDeleteButton Handler for delete button
  * @param {string} obj.notificationsId Used to give elements unique id attributes
  */
function NotificationItem({
  notification,
  notificationsChanged,
  setNotificationsChanged,
  handleDeleteButton,
  notificationId
}) {
  // Strings for event start and end dates and times
  const [startDateStr, setStartDateStr] = useState('');
  const [startTimeStr, setStartTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');

  // State for if user has accepted the invitation
  const [hasAccepted, setHasAccepted] = useState('false');

  // Errors
  const [errors, setErrors] = useState({})

  // Current user
  const currentUser = useCurrentUser();

  // Handle event accept/decline buttons
  const handleEventResponse = async (e) => {

    // Create response object from value of button, attempt to post and set state
    const eventResponse = { event_response: e.target.value }
    try {
      await axiosReq.post(`/events/response/${notification?.event?.id}/`, eventResponse);
      setHasAccepted(e.target.value === 'accept');

      // Communicate to parent that the status of the notification changed
      setNotificationsChanged(!notificationsChanged);
      setErrors({});
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors({ event_response: 'There was an error processing your response to this event. The event may have been deleted, you may be offline, or there may have been a server error.' })
      }
    }
  }

  useEffect(() => {
    // Check if this user has accepted the invitation by comparing to each user in the event.accepted field in turn
    const checkAccepted = () => (notification?.event?.accepted?.reduce(
      (acc, user) => (user.user_id === currentUser.pk) || acc
      , false))

    const hasAcceptedData = checkAccepted();
    setHasAccepted(hasAcceptedData);

    const eventDate = new Date(notification?.event?.start);

    // Extract date and time strings for start date
    setStartDateStr(eventDate.toDateString('en-UK', { dateStyle: 'short' }));
    setStartTimeStr(eventDate.toLocaleTimeString('en-UK', { timeStyle: 'short' }));

    // Calculate end date from duration
    // Split duration string into array of hours, mins, secs and convert to array of ints
    const hoursMinsSecsStr = notification?.event?.duration.split(':');
    const hoursMinsSecs = hoursMinsSecsStr.map((str) => parseInt(str));

    // Convert hours, mins and secs to milliseconds, calculate end date and format for display
    const durationMilliSecs = (hoursMinsSecs[1] * 60) * 1000 + (hoursMinsSecs[0] * 60 * 60 * 1000);
    const endDate = new Date(notification?.event?.start);
    endDate.setTime(endDate.getTime() + durationMilliSecs);

    // Extract date and time strings for end date
    setEndDateStr(endDate.toDateString('en-UK', { dateStyle: 'short' }))
    setEndTimeStr(endDate.toLocaleTimeString('en-UK', { timeStyle: 'short' }));

  }, [currentUser, notification])

  return (

    // Return list item representing the notification
    <li>
      <div className="rounded-sm mb-1 p-1 bg-base-100">
        <h2 className="text-base text-base-content font-nunito text-center">{notification.subject}</h2>
        <p className="text-sm text-center">{notification.message}</p>
        <p className="text-sm text-left"><span>Start: </span><br /><span>{startDateStr} {startTimeStr}</span></p>
        <br />
        <p className="text-sm text-left"><span>End: </span><br /><span>{endDateStr} {endTimeStr}</span></p>

        {/* Check this notification is for an event and show going/not going buttons if so. Also a delete button */}
        {/* Currently this is the only type of notification, but others could be added in future */}
        {
          notification.type = 'INV' &&
          <div className="btn-group justify-center">
            <button
              className={"btn btn-xs " + (!hasAccepted && "btn-active")}
              name='not-going'
              id={`${notificationId}-not-going`}
              value='decline'
              onClick={handleEventResponse}
            >
              Not going
            </button>
            <button
              className={"btn btn-xs " + (hasAccepted && "btn-active")}
              name='not-going'
              id={`${notificationId}-going`}
              value='accept'
              onClick={handleEventResponse}
            >
              Going
            </button>
            <button className="btn btn-xs btn-outline" id={`${notificationId}-delete`} onClick={() => handleDeleteButton(notification.id)}>
              <Trash3 size="16" />
              <span className="sr-only">Delete notification</span>
            </button>
          </div>
        }
      </div>

      {/* Display alert if there was an issue dealing with the user's response to the event */}
      {/* Technique for adding an element to a different location in the DOM is from */}
      {/* https://upmostly.com/tutorials/modal-components-react-custom-hooks */}
      {
        errors.event_response && ReactDOM.createPortal(
          <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
            <div>
              <InfoCircle size="32" className="m-auto" />
            </div>
            <div>
              <p>{errors.event_response}</p>
            </div>
          </div>
          , document.getElementById('Header'))
      }
    </li>
  )
}

export default NotificationItem