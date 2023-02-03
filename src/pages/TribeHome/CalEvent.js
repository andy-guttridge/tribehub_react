import React from 'react'
import Avatar from '../../components/Avatar'

function CalEvent({ event }) {
  
  // Extract the first five people involved in this event,
  // including the owner and invitees. Set flag if there will be more than
  // four invitees (plus the owner).
  const users = [];
  users.push(event.user);
  const moreThanFour = event.to.length > 4;
  for (let i = 0; i < event.to.length; i++) {
    if(i > 3){break;}
    users.push(event.to[i])
  }
  
  // Convert event start date string to an actual date and format for display
  const eventDate = new Date(event.start);
  const eventTimeStr = eventDate.toLocaleTimeString('en-UK', {timeStyle: 'short'});
  
  // Split duration string into array of hours, mins, secs and convert to array of ints
  const hoursMinsSecsStr = event.duration.split(":");
  const hoursMinsSecs = hoursMinsSecsStr.map((str) => parseInt(str));

  // Convert hours, mins and secs to milliseconds, calculate end date and format for display
  const durationMilliSecs = (hoursMinsSecs[1] * 60) * 1000 + (hoursMinsSecs[0] * 60 * 60 * 1000);
  const endDate = new Date(event.start);
  endDate.setTime(endDate.getTime() + durationMilliSecs);
  const endTimeStr = endDate.toLocaleTimeString('en-UK', {timeStyle: 'short'});

  return (
    <div className="card border-b-2 rounded-sm w-4/5 lg:w-1/2 m-2 inline-block text-center">
      <div className="card-title flex justify-between">

        <h4 className="text-sm">{event.subject}</h4>
        <div className="avatar-group -space-x-6">
          {/* Return an avatar for each user */}
          {
            users.map((toUser) => {
              return (<Avatar small imageUrl={toUser.image} key={`event-to${event.id}-${toUser.user_id}`} />)
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
      <div className="card-body">
        <span>{eventTimeStr} - {endTimeStr}</span>
      </div>
    </div>
  )
}

export default CalEvent