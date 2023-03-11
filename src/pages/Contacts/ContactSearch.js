import React, { useEffect, useState } from 'react';
import { InfoCircle } from 'react-bootstrap-icons';
import ReactDOM from 'react-dom';

import { axiosReq } from '../../api/axiosDefaults';
import ConfirmModal from '../../components/ConfirmModal';
import Spinner from '../../components/Spinner';
import Contact from './Contact';
import css from '../../styles/ContactSearch.module.css';

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

  // Flag for when user is in the process of deleting a contact.
  // If user is deleting a contact, the id of the contact is stored here.
  const [isDeletingContact, setIsDeletingContact] = useState(false);

  // Handle change of form input value
  const handleChange = (e) => {
    setSearchValue(e.target.value);
  }

  // Handle delete button by storing contact id
  const handleDeleteButton = (contactId) => {
    setIsDeletingContact(contactId);
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
      } catch (error) {
        if (error.response?.status !== 401) {
          setErrors({ contacts: 'There was an error loading search results. You may be offline, or there may have been a server error.' });
        }
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

  // Delete the contact if user confirms deletion
  const doDelete = async () => {
    try {
      await axiosReq.delete(`contacts/${isDeletingContact}/`);
      setDidSaveContact(!didSaveContact);
      setIsDeletingContact(false);
    } catch (error) {
      setIsDeletingContact(false);
      setErrors({ delete: 'There was a problem deleting this contact. You may be offline, or there may have been a server error.' });
    }
  }

  return (
    <section className={`basis-full ${css.ContactsSearchExpand}`}>
      <h3>Search contacts</h3>

      {/* Display alert if there was an issue fetching contact data */}
      {
        errors.contacts &&
        <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
          <div>
            <InfoCircle size="32" />
          </div>
          <div>
            <p>{errors.contacts}</p>
          </div>
        </div>
      }

      {/* Display alert if there was an issue deleting a contact */}
      {
        errors.delete &&
        <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
          <div>
            <InfoCircle size="32" />
          </div>
          <div>
            <p>{errors.delete}</p>
          </div>
        </div>
      }

      <form className="md:mx-2">

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
        <button type="button" onClick={handleCancelButton} className="btn btn-outline" id="cancel-contact-search-btn">Cancel search</button>
      </form>

      {/* Display contacts using search results */}
      <div>
        {
          hasLoaded ? (
            contacts?.results?.map((contact, i) => {
              return <Contact
                contact={contact}
                key={`contact-${contact.id}-${i}`}
                didSaveContact={didSaveContact}
                setDidSaveContact={setDidSaveContact}
                handleDeleteButton={handleDeleteButton}
              />
            })
          ) : (
            <Spinner />
          )
        }
      </div>

      {/* If tribe admin has selected to delete a contact, show the modal to confirm or cancel */}
      {/* // Technique to use ReactDOM.createPortal to add a modal to the end of the DOM body from
          // https://upmostly.com/tutorials/modal-components-react-custom-hooks */}
      {
        isDeletingContact && ReactDOM.createPortal(
          <ConfirmModal
            heading="Delete contact"
            body={`Are	you sure you want to delete this contact?`}
            cancelHandler={() => setIsDeletingContact(false)}
            confirmHandler={doDelete}
          />, document.body)
      }
    </section>
  )
}

export default ContactSearch