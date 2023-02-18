import React, { useEffect, useState } from 'react'
import { PlusCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom'
import { axiosReq } from '../../api/axiosDefaults';
import Spinner from '../../components/Spinner';
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import { useSinglePage } from '../../contexts/SinglePageContext';
import Contact from './Contact';
import ContactDetailsForm from './ContactDetailsForm';

function Contacts() {

  // Reference to current user
  const currentUser = useCurrentUser();

  // Enables navigation
  const navigate = useNavigate();

  // Hook to determine whether the component is being presented as part of a single page view
  const singlePage = useSinglePage();

  // Styles to apply if app is in single page mode
  const singlePageStyles = "basis-4/5 border-solid border-2 flex-none m-2"

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

  // Check if user logged in on mount, if not redirect to landing page
  useEffect(() => {
    !currentUser && navigate("/")
  }, [])

  // Fetch users contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      console.log(currentUser.username)
      try {
        setHasLoaded(false);
        const { data } = await axiosReq.get('contacts/');
        setContacts(data);
        setHasLoaded(true);
      }
      catch (error) {
        setErrors(errors);
      }
    }
    fetchContacts();
  }, [didSaveContact])

  return (
    // Apply some styling if displaying in single page mode
    <div
      className={
        singlePage ? singlePageStyles : undefined
      }
    >
      <h2>Contacts</h2>

      {/* Display contacts */}
      {
        hasLoaded ? (
          <div className="inline-block w-4/5">
            {/* Display message if there are no tribe contacts yet */}

            {
              !contacts?.results?.length && <p className="text-left md:text-center">Press the + button to start adding your tribe's contacts</p>
            }

            {
              contacts?.results?.map((contact) => {
                return <Contact contact={contact} key={contact.id} />
              })
            }
          </div>
        ) : (
          <Spinner />
        )
      }

      {/* Show add contact button if user is tribe admin and they are not currently adding a contact */}
      <div className="justify-end flex w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">
        {!isAddingContact && currentUser.is_admin &&
          <button className='btn btn-ghost'
            onClick={() => setIsAddingContact(!isAddingContact)}>
            <PlusCircle size="32" />
            <span className="sr-only">Add new contact</span>
          </button>
        }
      </div>

      {/* Show contact details form if user is currently adding a contact */}
      {
        isAddingContact && currentUser.is_admin &&
        <ContactDetailsForm
          handleCancelButton={() => setIsAddingContact(!isAddingContact)}
          didSaveContact={didSaveContact}
          setDidSaveContact={setDidSaveContact}
        />
      }

    </div>
  )
}

export default Contacts