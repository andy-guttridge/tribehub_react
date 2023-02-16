import React, { useEffect, useState } from 'react'
import { Bell } from 'react-bootstrap-icons'
import { axiosReq } from '../api/axiosDefaults';
import NotificationItem from './NotificationItem'
import Spinner from './Spinner';

function NotficationsMenu() {

  // State variable to flag if data is loading
  const [hasLoaded, setHasLoaded] = useState(false);

  // State variable to store notifications
  const [notifications, setNotifications] = useState({});
  
  // State variable to trigger notifications to reload when a user has accepted or declined an event.
  // The value is simply toggled when there is a change to trigger a re-load.
  const [notificationsChanged, setNotificationsChanged] = useState(false);

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
          <Bell size="16" />
        </ label>
        <ul tabIndex="0" className="dropdown-content p-2 shadow bg-base-100 rounded-box w-52">
          {
            hasLoaded ? (
              <>
                {
                  notifications?.results?.map((notification) => {
                    return <NotificationItem notification={notification} key={`notification-${notification.id}`} notificationsChanged={notificationsChanged} setNotificationsChanged={setNotificationsChanged}/>
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
    </div>
  )
}

export default NotficationsMenu