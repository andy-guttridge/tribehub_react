import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';

import { eventCategories } from '../../utils/constants';

function EventSearch({ handleCancelButton }) {

  // State variables for user's tribe members
  const [tribe, setTribe] = useState({ results: [] });

  // State variables for errors
  const [errors, setErrors] = useState({});

  // State variable for if required data from the API has loaded
  const [hasLoaded, setHasLoaded] = useState(false);

  // State variables for search values
  const [searchValues, setSearchValues] = useState({
    text_search: '',
    category_search: '',
    tribe_search: []
  })

  // Retrieve search values from state variables
  const { text_search, category_search, tribe_search } = searchValues;

  useEffect(() => {
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

  // Fetch events according to search values
  useEffect(() => {

    // Create URL parameter strings for text_search and the category and tribe search arrays, then concatenate them
    const textSearch = `?search=${text_search}`;
    const categorySearch = category_search ? `category=${category_search}` : '';
    const tribeSearch = tribe_search.reduce((acc, tribeMember) => acc + `&to=${tribeMember}`, '');
    const finalSearchString = textSearch.concat(categorySearch, tribeSearch)

    const fetchEvents = async () => {
      try {
        const { data } = await axiosReq.get(`events/${finalSearchString}`);
        console.log(data.results)
      }
      catch (errors) {
        setErrors(errors);
      }
    }
    fetchEvents();
  }, [searchValues])

  // Change handler for text search field
  const handleChange = (e) => {
    setSearchValues({
      ...searchValues,
      [e.target.name]: e.target.value
    }
    )
  }

  // Change handler for multiple selection form fields
  // Code to handle multiple selections in controlled React forms is from
  // https://stackoverflow.com/questions/50090335/how-handle-multiple-select-form-in-reactjs
  const handleMultipleSelectChange = (e) => {
    // Get full array of options from click event, and map over them
    // to find out if they are selected - if so, add to array
    const options = Array.from(e.target.options);
    const searchValue = [];
    options.map((option) => {
      option.selected && searchValue.push(option.value)
    })

    // Set value of the form element using the array
    setSearchValues({
      ...searchValues,
      [e.target.name]: searchValue
    })
  }

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
            id="text_search"
            name="text_search"
            value={text_search}
            onChange={handleChange}
          />
        </label>

        {/* Category search field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="category-search">
          <span>Category:</span>

          {/* How to iterate over values of an object in React is from */}
          {/* https://stackoverflow.com/questions/40803828/how-can-i-map-through-an-object-in-reactjs */}
          <select
            className="input input-bordered w-full"
            id="category_search"
            name="category_search"
            value={category_search}
            onChange={handleChange}
          >
            <option value="" key="empty-category">--</option>
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
            id="tribe_search"
            name="tribe_search"
            value={tribe_search}
            onChange={handleMultipleSelectChange}
            multiple={true}
          >
            {
              tribe?.results[0]?.users?.map((tribeMember) => {
                return <option value={tribeMember.user_id} key={`tribe-${tribeMember.user_id}`}>{tribeMember.display_name}</option>
              })
            }
          </select>
        </label>

        <button onClick={handleCancelButton} className="btn btn-outline">Cancel search</button>
      </form>
    </div>
  )
}

export default EventSearch