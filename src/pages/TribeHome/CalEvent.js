import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons';

import Avatar from '../../components/Avatar'
import { eventCategories } from '../../utils/constants';
import styles from '../../styles/CalEvent.module.css'

function CalEvent({ event }) {

  // Extract the first five people involved in this event,
  // including the owner and invitees. Set flag if there will be more than
  // four invitees (plus the owner).
  const users = [];
  users.push(event.user);
  const moreThanFour = event.to.length > 4;
  for (let i = 0; i < event.to.length; i++) {
    if (i > 3) { break; }
    users.push(event.to[i])
  }

  // Convert event start date string to an actual date and format for display
  const eventDate = new Date(event.start);
  const eventTimeStr = eventDate.toLocaleTimeString('en-UK', { timeStyle: 'short' });

  // Split duration string into array of hours, mins, secs and convert to array of ints
  const hoursMinsSecsStr = event.duration.split(":");
  const hoursMinsSecs = hoursMinsSecsStr.map((str) => parseInt(str));

  // Convert hours, mins and secs to milliseconds, calculate end date and format for display
  const durationMilliSecs = (hoursMinsSecs[1] * 60) * 1000 + (hoursMinsSecs[0] * 60 * 60 * 1000);
  const endDate = new Date(event.start);
  endDate.setTime(endDate.getTime() + durationMilliSecs);
  const endTimeStr = endDate.toLocaleTimeString('en-UK', { timeStyle: 'short' });

  // Extract user_ids of users who have accepted the invitation
  const acceptedUserIds = event.accepted.map((user) => user.user_id);
  acceptedUserIds.push(event.user.user_id)

  return (
    <div className="card border-b-2 rounded-sm m-2 text-center">

      {/* Card title */}
      <div className="card-title flex justify-between">
        <h4 className="text-sm">{event.subject}{event.recurrence_type !== 'NON' && <ArrowRepeat size="16" />}</h4>
        <div className="avatar-group -space-x-6">
          {/* Return an avatar for each user */}
          {/* Include a prop to say whether they have accepted the invitation */}
          {
            users.map((toUser) => {
              return (
                <Avatar
                  small
                  imageUrl={toUser.image}
                  key={`event-to${event.id}-${toUser.user_id}`}
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

      {/* Card body */}
      <div className="card-body grid grid-cols-2">
        {/* Event category icon */}
        <img src={require(`../../assets/categories/${eventCategories[event.category].image}`)} className={`w-12 ${styles.CategoryIcon}`} />
        <span>{eventTimeStr} - {endTimeStr}</span>
      </div>

      {/* Collapse section for more detail */}
      <div className="collapse collapse-arrow">
        <input type="checkbox" />
        <div className="collapse-title text-right">Detail</div>
        <div className="collapse-content">
          <div className="grid grid-cols-2 justify-items-center">
            <div>
              {/* Retrieve and display the users invited */}
              <h5>To:</h5>
              {event.to?.map((user, i) => {
                return (
                  <span className={`${styles.User} m-2`} key={`${user.user_id}-${i}`}>{user.display_name} </span>
                )
              })}
            </div>
            
            <div>
              {/* Retrieve and display the users who have accepted */}
              <h5>Accepted:</h5>
              {event.accepted?.map((user, j) => {
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