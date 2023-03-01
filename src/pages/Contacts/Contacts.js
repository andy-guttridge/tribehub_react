import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { InfoCircle, PlusCircle, Search } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom'

import { axiosReq } from '../../api/axiosDefaults';
import Spinner from '../../components/Spinner';
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import { useSinglePage } from '../../contexts/SinglePageContext';
import Contact from './Contact';
import ContactDetailsForm from './ContactDetailsForm';
import ConfirmModal from '../../components/ConfirmModal';
import ContactSearch from './ContactSearch';

function Contacts() {

  // Reference to current user
  const currentUser = useCurrentUser();

  // Enables navigation
  const navigate = useNavigate();

  // Hook to determine whether the component is being presented as part of a single page view
  const singlePage = useSinglePage();

  // Styles to apply if app is in single page mode
  const singlePageStyles = 'basis-4/5 rounded-lg flex-none mr-2 mt-2 bg-base-100'

  // State variables for tribe contacts
  const [contacts, setContacts] = useState([]);

  // State variables to record if data has loaded
  const [hasLoaded, setHasLoaded] = useState(false);

  // State variables for errors
  const [errors, setErrors] = useState({});

  // State variables for whether user is adding a contact
  const [isAddingContact, setIsAddingContact] = useState(false);

  // State variable used as a flag when contact details are saved.
  // This is simply toggles to trigger events to reload when there has been a change.
  const [didSaveContact, setDidSaveContact] = useState(false);

  // State variable for id of contact being deleted, or false if user is not currently deleting a contact
  const [isDeletingContact, setIsDeletingContact] = useState(false);

  // State variable for whether user is currently searching contacts
  const [isSearching, setIsSearching] = useState(false);

  // Handle user pressing delete contact button by storing the contact id
  const handleDeleteButton = (contactId) => {
    setIsDeletingContact(contactId);
  }

  // Delete the contact if user confirms deletion
  const doDelete = async () => {
    try {
      await axiosReq.delete(`contacts/${isDeletingContact}/`);
      setDidSaveContact(!didSaveContact);
      setIsDeletingContact(false);
    } catch (error) {
      if (error.response?.status !== 401) {
        setIsDeletingContact(false);
        setErrors({ delete: 'There was a problem deleting this contact. You may be offline, or there may have been a server error.' });
      }
    }
  }

  // Check if user logged in on mount, if not redirect to landing page.
  // Scroll to top of page if not in single page mode.
  useEffect(() => {
    !currentUser && navigate("/");
    !singlePage && window.scrollTo(0, 0);
  }, [currentUser, navigate, singlePage])

  // Fetch users contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setHasLoaded(false);
        const { data } = await axiosReq.get('contacts/');
        setContacts(data);
        setHasLoaded(true);
        setErrors({});
      } catch (error) {
        if (error.response?.status !== 401) {
          setErrors({ contacts: 'There was a problem loading your contacts. You may be offline, or there may have been a server error.' });
        }
      }
    }
    fetchContacts();
  }, [didSaveContact, isSearching])

  return (
    // Apply some styling if displaying in single page mode
    <div
      className={
        singlePage ? singlePageStyles : "bg-base-100"
      }
    >
      <h2>Contacts</h2>

      {/* Display alert if there was an issue fetching contact data */}
      {
        errors.contacts &&
        <div className="alert alert-warning w-3/4 inline-block m-4 justify-center text-center">
          <InfoCircle size="32" className="inline-block" /><p>{errors.contacts}</p>
        </div>
      }

      {/* Display alert if there was an issue deleting a contact */}
      {
        errors.delete &&
        <div className="alert alert-warning w-3/4 inline-block m-4 justify-center text-center row-end-1">
          <InfoCircle size="32" className="inline-block" /><p>{errors.delete}</p>
        </div>
      }

      {/* Show add contact button if user is tribe admin, they are not currently adding a contact and user does not have the search form open */}
      <div className="justify-end flex w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">
        {!isAddingContact && !isSearching && currentUser?.is_admin &&
          <button className="btn btn-ghost"
            onClick={() => setIsAddingContact(!isAddingContact)}
            type="button"
          >
            <PlusCircle size="32" className="text-primary" />
            <span className="sr-only">Add new contact</span>
          </button>
        }

        {/* Show search button or search form if user has pressed the button */}
        {
          !isSearching && !isAddingContact ? (
            <button
              onClick={() => setIsSearching(!isSearching)}
              className="btn btn-ghost"
              type="button"
            >
              <Search size="32" className="text-primary" /><span className="sr-only">Search contacts</span>
            </button>
          ) : isSearching && (
            <ContactSearch handleCancelButton={() => setIsSearching(false)} />
          )
        }
      </div>

      {/* Show contact details form if user is currently adding a contact and doesn't have the search form open */}
      {
        isAddingContact && !isSearching && currentUser?.is_admin &&
        <ContactDetailsForm
          handleCancelButton={() => setIsAddingContact(!isAddingContact)}
          didSaveContact={didSaveContact}
          setDidSaveContact={setDidSaveContact}
        />
      }


      {/* Display contacts */}
      {
        hasLoaded ? (
          <div className="inline-block w-full bg-base-200">
            {/* Display message if there are no tribe contacts yet */}

            {
              !contacts?.results?.length && <p className="text-left md:text-center">Press the + button to start adding your tribe's contacts</p>
            }

            {
              // Don't display contacts here if user is searching
              !isSearching &&
              contacts?.results?.map((contact) => {
                return <Contact
                  contact={contact}
                  key={contact.id}
                  handleDeleteButton={handleDeleteButton}
                  didSaveContact={didSaveContact}
                  setDidSaveContact={setDidSaveContact}
                />
              })
            }
          </div>

        ) : (
          <Spinner />
        )
      }

      {
        // Empty div with margin to provide clearance above bottom navbar if not in single page mode
        !singlePage && <div className="mb-4 bg-base-100"><br /></div>
      }

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
    </div>
  )
}

export default Contacts