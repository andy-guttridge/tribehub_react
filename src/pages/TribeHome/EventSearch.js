import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';

import { eventCategories } from '../../utils/constants';

function EventSearch({ handleCancelButton }) {

  // State variables for user's tribe members
  const [tribe, setTribe] = useState({ results: [] });

  // State variables for errors
  const [errors, setErrors] = useState({});

  // State variable for if requried data from the API has loaded
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() =>{
    const fetchTribe = async () => {
      try {
        const { data } = await axiosReq.get('tribe/');
        setTribe(data);
        setHasLoaded(true);
      }
      catch (error) {
        setErrors({ tribe: 'There was an error loading tribe data from the server.' })
      }
    }
    fetchTribe();
  }, [])
  

  return (
    <div className="basis-full">
      <h3>Search events</h3>
      <form>

        {/* Text search field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="text-search">
          <span>Text search:</span>
          <input
            type="text"
            className="input input-bordered w-full"
            id="text-search"
            name="text-search"
            // value={text-search}
            // onChange={handleChange}
          />
        </label>

        {/* Category search sfield */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="category-search">
            <span>Category:</span>

            {/* How to iterate over values of an object in React is from */}
            {/* https://stackoverflow.com/questions/40803828/how-can-i-map-through-an-object-in-reactjs */}
            <select
              className="input input-bordered w-full"
              required
              id="category-search"
              name="category-search"
              // value={category-search}
              // onChange={handleChange}
            >
              {
                Object.keys(eventCategories).map((keyName) => {
                  return <option value={keyName} key={`category-${keyName}`}>{eventCategories[keyName].text}</option>
                })
              }
            </select>
          </label>
          
          {/* Tribe members search field */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="tribe-search">
            <span>Tribe member search:</span>
            <select
              className="input input-bordered w-full"
              id="to"
              name="to"
              // value={tribe-search}
              // onChange={tribe-search}
              multiple={true}
            >
              {
                tribe?.results[0]?.users?.map((tribeMember) => {
                  return <option value={tribeMember.user_id} key={`tribe-${tribeMember.user_id}`}>{tribeMember.display_name}</option>
                })
              }
            </select>
          </label>



      </form>


      <button onClick={handleCancelButton} className="btn btn-outline">Cancel</button>
    </div>
  )
}

export default EventSearch