import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';
import Spinner from '../../components/Spinner';
import Contact from './Contact';

function ContactSearch({ handleCancelButton }) {

  // State variable for whether search results have loaded
  const [hasLoaded, setHasLoaded] = useState(false);

  // State variable for search term
  const [searchValue, setSearchValue] = useState('');

  // State variable for search results
  const [contacts, setContacts] = useState({});

  // State variables for errors
  const [errors, setErrors] = useState({});

  // Flag for when a contact has been changed or deleted.
  // This is simply toggled to trigger a reload of the data
  const [didSaveContact, setDidSaveContact] = useState(false);


  // Handle change of form input value
  const handleChange = (e) => {
    setSearchValue(e.target.value);
  }

  // Handle delete button on a contact
  const handleDeleteButton = () =>  {

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
      }
      catch (error) {
        setErrors({events: 'There was an error loading search results. You may be offline, or there may have been a server error.'});
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

  }, [searchValue, didSaveContact])

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
          hasLoaded ? (
            contacts?.results?.map((contact, i) => {
              return <Contact contact={contact} key={`contact-${contact.id}-${i}`} didSaveContact={didSaveContact} setDidSaveContact={setDidSaveContact} handleDeleteButton={handleDeleteButton}/>
            })
          ) : (
            <Spinner />
          )
        }
      </div>
    </div>
  )
}

export default ContactSearch