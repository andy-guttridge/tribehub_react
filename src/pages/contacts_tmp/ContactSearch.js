import React, { useEffect, useState } from 'react';
import { InfoCircle } from 'react-bootstrap-icons';
import ReactDOM from 'react-dom';

import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import ConfirmModal from '../../components/ConfirmModal';
import Spinner from '../../components/Spinner';
import Contact from './Contact';
import css from '../../styles/ContactSearch.module.css';

/**
 * Contacts search form and results
 * @component
 * @param {object} obj Props
 * @param {function} obj.handleCancelButton Handler for cancel button
 * @param {function} obj.setActionSucceeded Sets a success message when a request resulting in a change to data succeeds
 */
function ContactSearch({ handleCancelButton, setActionSucceeded }) {
  // State for whether search results have loaded
  const [hasLoaded, setHasLoaded] = useState(false);

  // State for search term
  const [searchValue, setSearchValue] = useState('');

  // State for search results
  const [contacts, setContacts] = useState({});

  // Errors
  const [errors, setErrors] = useState({});

  // Toggle when a contact has been changed or deleted to trigger a refresh of data
  const [didSaveContact, setDidSaveContact] = useState(false);

  // State for when user is in the process of deleting a contact. If user is deleting a contact, id of the contact is stored here.
  const [isDeletingContact, setIsDeletingContact] = useState(false);

  const handleChange = (e) => {
    /**
     * Handle change of form input value
     */
    setSearchValue(e.target.value);
  }

  const handleDeleteButton = (contactId) => {
    /** 
     * Handle delete button by storing contact id
     */
    setIsDeletingContact(contactId);
  }

  useEffect(() => {
    /**
     * Fetch contacts according to search values
     */
    const fetchContacts = async () => {
      try {
        setHasLoaded(false);
        const { data } = await axiosRes.get(`contacts/?search=${searchValue}`);
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

  const doDelete = async () => {
    /**
     *  Handle delete contact if user confirms
     */
    try {
      await axiosReq.delete(`contacts/${isDeletingContact}/`);
      setDidSaveContact(!didSaveContact);
      setIsDeletingContact(false);
      setActionSucceeded('The contact was deleted')
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

      <form className="w-4/5 m-auto md:w-full md:px-2">

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
      <div className="bg-base-200">
        {
          hasLoaded ? (
            contacts?.results?.map((contact, i) => {
              return <Contact
                contact={contact}
                key={`contact-${contact.id}-${i}`}
                didSaveContact={didSaveContact}
                setDidSaveContact={setDidSaveContact}
                handleDeleteButton={handleDeleteButton}
                setActionSucceeded={setActionSucceeded}
              />
            })
          ) : (
            <div className="bg-base-100">
              <Spinner />
            </div>
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