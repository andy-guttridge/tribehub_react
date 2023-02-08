import React from 'react';

import { eventCategories } from '../../utils/constants';

function EventDetailsForm({ handleNewEventButton }) {
  return (
    <div className="basis-full">
      <h3>Add a calendar event</h3>

      {/* Add event form */}
      <form>
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="to">
          <span>To:</span>
          <select>
          </select>
        </label>

        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="start">
          <span>Date and time:</span>
          <input
            type="datetime-local"
            className="input input-bordered w-full"
          />
        </label>

        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="duration">
          <span>Duration:</span>
          <select>
            <option value="00:15:00">15 minutes</option>
            <option value="00:30:00">30 minutes</option>
            <option value="00:45:00">45 minutes</option>
            <option value="01:00:00">1 hour</option>
            <option value="01:30:00">90 minutes</option>
            <option value="02:00:00">2 hours</option>
            <option value="03:00:00">3 hours</option>
            <option value="04:00:00">4 hours</option>
            <option value="05:00:00">5 hours</option>
            <option value="06:00:00">6 hours</option>
          </select>
        </label>

        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="to">
          <span>Repeat:</span>
          <select>
            <option value="NON">None</option>
            <option value="DAI">Daily</option>
            <option value="WEK">Weekly</option>
            <option value="TWK">Two weekly</option>
            <option value="MON">Monthly</option>
            <option value="YEA">Yearly</option>
          </select>
        </label>

        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="subject">
          <span>Subject:</span>
          <input
            type="text"
            className="input input-bordered w-full"
          />
        </label>

        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="category">
          <span>Category:</span>

          {/* How to iterate over values of an object in React is from */}
          {/* https://stackoverflow.com/questions/40803828/how-can-i-map-through-an-object-in-reactjs */}
          <select>
            {
              Object.keys(eventCategories).map((keyName, i) => {
                return <option value={keyName} key={i}>{eventCategories[keyName].text}</option>
              })
            }
          </select>
        </label>

        <button className="btn btn-outline m-2}" type="button" onClick={handleNewEventButton}>Cancel</button>
        <button className="btn btn-outline w-1/3 m-2" type="submit">Submit</button>

      </form>
    </div>
  )
}

export default EventDetailsForm