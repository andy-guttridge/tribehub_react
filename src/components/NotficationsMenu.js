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
  }, [])

  return (
    <div className="inline-block mx-2">
      <div className="dropdown dropdown-end">
        <label tabIndex="0" className="btn btn-sm btn-ghost">
          <Bell size="16" />
        </ label>
        <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          {
            hasLoaded ? (
              <>
                {
                  notifications?.results?.map((notification) => {
                    return <NotificationItem notification={notification} key={`notification-${notification.id}`}/>
                  })
                }
              </>
            ) : (
                <Spinner />
            )
          }
        </ul>
      </div>
    </div>
  )
}

export default NotficationsMenu