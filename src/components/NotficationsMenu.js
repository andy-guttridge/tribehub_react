import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Bell, InfoCircle } from 'react-bootstrap-icons'

import { axiosReq } from '../api/axiosDefaults';
import NotificationItem from './NotificationItem'
import Spinner from './Spinner';
import ConfirmModal from './ConfirmModal';

function NotficationsMenu() {

  // State variable to flag if data is loading
  const [hasLoaded, setHasLoaded] = useState(false);

  // State variable to store notifications
  const [notifications, setNotifications] = useState({});

  // State variable for errors
  const [errors, setErrors] = useState({});

  // State variable to trigger notifications to reload when a user has accepted or declined an event.
  // The value is simply toggled when there is a change to trigger a re-load.
  const [notificationsChanged, setNotificationsChanged] = useState(false);

  // State variable to determine whether user is in the process of deleting a notification
  const [isDeletingNotification, setIsDeletingNotification] = useState(false);

  // Handle user pressing delete notification button by storing id of the notification
  const handleDeleteButton = (id) => {
    setIsDeletingNotification(id);
  }

  // Handle user confirming they want to delete the notification
  const doDelete = async () => {
    try {
      await axiosReq.delete(`notifications/${isDeletingNotification}/`);
      setNotificationsChanged(!notificationsChanged);
      setErrors({});
    } catch (error) {
      if(error.response?.status !== 401) {
        setErrors({ delete: 'There was an issue deleting this notification.\n\nYou may be offline, or there may have been a server error.' })
      }
    }
    setIsDeletingNotification(false);
  }

  useEffect(() => {
    // Fetch user's notifications
    const fetchNotifications = async () => {
      try {
        const { data } = await axiosReq.get('notifications/');
        setNotifications(data);
        setHasLoaded(true);
        setErrors({});
      } catch (error) {
        if(error.response?.status !== 401) {
          setErrors({ notifications: 'There was an issue fetching notification details.\n\nYou may be offline, or there may have been a server error.' })
        }
        
      }
    }

    fetchNotifications();
  }, [notificationsChanged])

  return (
    <div className="inline-block">
      {/* Dropdown containing notification items */}
      <div className="dropdown dropdown-end">
        <label tabIndex="0" className="btn btn-sm btn-ghost m-1">
          <div className="indicator">
            {notifications?.results?.length > 0 && <span className="indicator-item badge badge-xs badge-secondary">{notifications.results.length}</span>}
            <Bell size="20" className="text-primary"/>
          </div>
        </ label>
        <ul tabIndex="0" className="dropdown-content shadow bg-base-200 border border-base-200 w-56 lg:w-60">
          {
            hasLoaded ? (
              <>
                {/* Show message if user doesn't have any notifications */}
                {notifications?.results?.length === 0 && <li className="border rounded-sm border-base-200 bg-base-100">You have no notifications</li>}
                {
                  // Otherwise, display the notifications
                  notifications?.results?.map((notification) => {
                    return <NotificationItem
                      notification={notification}
                      key={`notification-${notification.id}`}
                      notificationsChanged={notificationsChanged}
                      setNotificationsChanged={setNotificationsChanged}
                      handleDeleteButton={handleDeleteButton}
                    />
                  })
                }
              </>
            ) : (

              // Display spinner if notifications haven't loaded
              <li>
                <Spinner small />
              </li>
            )
          }
        </ul>
      </div>

      {/* If user has selected to delete a notification, show the modal to confirm or cancel */}
      {/* // Technique to use ReactDOM.createPortal to add a modal to the end of the DOM body from
          // https://upmostly.com/tutorials/modal-components-react-custom-hooks */}
      {
        isDeletingNotification && ReactDOM.createPortal(
          <ConfirmModal
            heading="Delete notification"
            body="Are you sure you want to delete this notification?"
            cancelHandler={() => setIsDeletingNotification(false)}
            confirmHandler={doDelete}
          />, document.body
        )
      }

      {/* Display alert if there was an issue deleting a tribe member */}
      {/* Same technique used to add the alert to the Header component as noted above. */}
      {
        errors.delete && ReactDOM.createPortal(
          <div className="flex justify-center">
            <div className="alert alert-warning justify-start m-4 w-4/5 md:w-2/3 lg:1/2 block">
              <InfoCircle size="32" className="inline-block" /><span>{errors.delete}</span>
            </div>
          </div>
          , document.getElementById('Header'))
      }

      {/* Display alert if there was an issue deleting a tribe member */}
      {/* Same technique used to add the alert to the Header component as noted above. */}
      {
        errors.notifications && ReactDOM.createPortal(
          <div className="flex justify-center">
            <div className="alert alert-warning justify-start m-4 w-4/5 md:w-2/3 lg:1/2 block">
              <InfoCircle size="32" className="inline-block" /><span>{errors.notifications}</span>
            </div>
          </div>
          , document.getElementById('Header'))
      }

    </div>
  )
}

export default NotficationsMenu