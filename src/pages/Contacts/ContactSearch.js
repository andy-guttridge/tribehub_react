import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';
import Contact from './Contact';

function ContactSearch({ handleCancelButton }) {

  // State variable for whether search results have loaded
  const [loaded, setHasLoaded] = useState(false);

  // State variable for search term
  const [searchValue, setSearchValue] = useState('');

  // State variable for search results
  const [contacts, setContacts] = useState({});

  // State variables for errors
  const [errors, setErrors] = useState({});

  // Handle change of form input value
  const handleChange = (e) => {
    setSearchValue(e.target.value);
  }

  // Fetch contacts according to search values
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setHasLoaded(false);
        const { data } = await axiosReq.get(`contacts/?search=${searchValue}`);
        setContacts(data);
        setHasLoaded(true);
        setErrors({});
        console.log(data);
      }
      catch (error) {
        setErrors(error);
      }
    }

    // Technique for using a timer to reduce number of network requests is from
    // Code Institute's Moments walkthrough project
    const timer = setTimeout(() => {
      fetchContacts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    }

  }, [searchValue])

  return (
    <div className="basis-full">
      <h3>Search contacts</h3>
      <form>
        {/* Contact search field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="contact-search">
          <span>Contact search:</span>
          <input
            type="text"
            className="input input-bordered w-full"
            id="contact-search"
            name="contact-search"
            value={searchValue}
            onChange={handleChange}
          />
        </label>
        <button onClick={handleCancelButton} className="btn btn-outline">Cancel search</button>
      </form>

      {/* Display contacts using search results */}
      <div>
        {
          contacts?.results?.map((contact, i) => {
            return <Contact contact={contact} key={`contact-${contact.id}-${i}`}/>
          })
        }
      </div>
    </div>
  )
}

export default ContactSearch