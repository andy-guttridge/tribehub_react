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

/**
 * Contacts page/section
 * @component
 */
function Contacts() {
  // Current user
  const currentUser = useCurrentUser();

  // Use to redirect user
  const navigate = useNavigate();

  // Check if we are in single page mode
  const singlePage = useSinglePage();

  // Styles to apply if app is in single page mode
  const singlePageStyles = 'basis-4/5 border border-base-300 rounded-lg flex-none mr-2 mt-2 md:mx-0.5 md:mt-0.5 bg-base-100'

  // State for tribe contacts
  const [contacts, setContacts] = useState([]);

  // State to record if data has loaded
  const [hasLoaded, setHasLoaded] = useState(false);

  // Errors
  const [errors, setErrors] = useState({});

  // State to confirm a change to data was successful
  const [actionSucceeded, setActionSucceeded] = useState('');

  // State for whether user is adding a contact
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Toggles to trigger contacts to reload when there has been a change.
  const [didSaveContact, setDidSaveContact] = useState(false);

  // State for id of contact being deleted, or false if user is not currently deleting a contact
  const [isDeletingContact, setIsDeletingContact] = useState(false);

  // State for whether user is currently searching contacts
  const [isSearching, setIsSearching] = useState(false);

  const handleDeleteButton = (contactId) => {
    /**
     * Handle user pressing delete contact button by storing the contact id
     */
    setIsDeletingContact(contactId);
  }

  const doDelete = async () => {
    /**
     * Handle confirmation contact to be deleted
     */
    try {
      await axiosReq.delete(`contacts/${isDeletingContact}/`);
      setDidSaveContact(!didSaveContact);
      setIsDeletingContact(false);
      setErrors({});
      setActionSucceeded('The contact was deleted');
    } catch (error) {
      if (error.response?.status !== 401) {
        setIsDeletingContact(false);
        setErrors({ delete: 'There was a problem deleting this contact. You may be offline, or there may have been a server error.' });
      }
    }
  }

  useEffect(() => {
    /**
     * Check if user logged in on mount, if not redirect to landing page. 
     * Scroll to top of page if not in single page mode.
     */
    !currentUser && navigate("/");
    !singlePage && window.scrollTo(0, 0);
  }, [currentUser, navigate, singlePage])

  useEffect(() => {
    /**
     * Fetch users contacts from API
     */
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

  useEffect(() => {
    /**
     * Set timeout and get rid of any success alert
     */
    const hideSuccess = setTimeout(() => {
      setActionSucceeded('');
    }, 5000);

    // Cleanup
    return () => { clearTimeout(hideSuccess) }
  }, [actionSucceeded]);

  return (
    // Apply styling if displaying in single page mode
    <section
      className={
        singlePage ? singlePageStyles : "bg-base-100"
      }
    >
      <h2>Contacts</h2>

      {/* Display alert if there was an issue fetching contact data */}
      {
        errors.contacts &&
        <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
          <div>
            <InfoCircle size="32" className="inline-block" />
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
            <InfoCircle size="32" className="inline-block" />
          </div>
          <div>
            <p>{errors.delete}</p>
          </div>
        </div>
      }

      {/* Show add contact button if user is tribe admin, they are not currently adding a contact and user does not have the search form open */}
      <div className="justify-end lg:justify-start flex w-4/5 md:w-full mx-auto my-4">
        {!isAddingContact && !isSearching && currentUser?.is_admin &&
          <button className="btn btn-ghost"
            onClick={() => setIsAddingContact(!isAddingContact)}
            type="button"
            id="add-contact-btn"
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
              id="contact-search-btn"
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
          setActionSucceeded={setActionSucceeded}
        />
      }

      {/* Display alert with success message if a request resulting in change of data succeeded */}
      {
        actionSucceeded !== '' &&
        <div className="fixed min-h-fit min-w-full top-0 left-0 z-10">
          <div className="alert alert-success justify-start w-3/4 md:w-1/2 lg:w-1/2 mx-auto mt-14">
            <div>
              <InfoCircle size="32" /><span>{actionSucceeded}</span>
            </div>
          </div>
        </div>
      }

      {/* Display contacts */}
      {
        hasLoaded ? (
          <div className="inline-block w-full bg-base-200">
            {/* Display message if there are no tribe contacts yet */}

            {
              !contacts?.results?.length && !isAddingContact && currentUser.is_admin &&
              <div className="bg-base-100 p-2">
                <div className="alert alert-info justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
                  <p className="text-left md:text-center font-bold">{`Press the + button to start adding your tribe's contacts`}</p>
                </div>
              </div>
            }

            {
              // Don't display contacts here if user is searching
              !isSearching &&
              contacts?.results?.map((contact) => {
                return <Contact
                  contact={contact}
                  key={`contact-${contact.id}`}
                  handleDeleteButton={handleDeleteButton}
                  didSaveContact={didSaveContact}
                  setDidSaveContact={setDidSaveContact}
                  setActionSucceeded={setActionSucceeded}
                />
              })
            }
          </div>

        ) : (
          <Spinner />
        )
      }

      {
        // Empty div with padding to provide clearance above bottom navbar if not in single page mode
        !singlePage && <div className="pb-4 bg-base-100"><br /></div>
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
    </section>
  )
}

export default Contacts