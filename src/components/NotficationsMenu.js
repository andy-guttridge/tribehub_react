import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Bell } from 'react-bootstrap-icons'
import { axiosReq } from '../api/axiosDefaults';
import NotificationItem from './NotificationItem'
import Spinner from './Spinner';
import ConfirmModal from './ConfirmModal';

function NotficationsMenu() {

  // State variable to flag if data is loading
  const [hasLoaded, setHasLoaded] = useState(false);

  // State variable to store notifications
  const [notifications, setNotifications] = useState({});

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
    }
    catch(error) {
      console.log(error?.response?.data);
    }
    setIsDeletingNotification(false);
  }

  useEffect(() => {
    // Fetch user's notifications
    const fetchNotifications = async () => {
      try {
        setHasLoaded(false);
        const { data } = await axiosReq.get('notifications/');
        setNotifications(data);
        setHasLoaded(true);
      }
      catch (error) {
        console.log(error);
      }
    }

    fetchNotifications();
  }, [notificationsChanged])

  return (
    <div className="inline-block mx-2">
      {/* Dropdown containing notification items */}
      <div className="dropdown dropdown-end">
        <label tabIndex="0" className="btn btn-sm btn-ghost">
          <div className="indicator">
            {notifications?.results?.length > 0 && <span className="indicator-item badge badge-xs badge-secondary">{notifications.results.length}</span>}
            <Bell size="20" />
          </div>
        </ label>
        <ul tabIndex="0" className="dropdown-content p-2 shadow bg-base-100 rounded-box w-52">
          {
            hasLoaded ? (
              <>
                {
                  notifications?.results?.map((notification) => {
                    return <NotificationItem notification={notification} key={`notification-${notification.id}`} notificationsChanged={notificationsChanged} setNotificationsChanged={setNotificationsChanged} handleDeleteButton={handleDeleteButton}/>
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
    </div>
  )
}

export default NotficationsMenu