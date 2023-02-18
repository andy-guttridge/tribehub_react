import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosReq } from '../../api/axiosDefaults';
import Spinner from '../../components/Spinner';
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import { useSinglePage } from '../../contexts/SinglePageContext';
import Contact from './Contact';

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
  const [contacts, setContacts] = useState({});

  // State variables to record if data has loaded
  const [hasLoaded, setHasLoaded] = useState(false);

  // State variables for errors
  const [errors, setErrors] = useState({});

  // Check if user logged in on mount, if not redirect to landing page
  useEffect(() => {
    !currentUser && navigate("/")
  }, [])

  // Fetch users contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setHasLoaded(false);
        const { data } = await axiosReq.get('contacts/');
        setContacts(data);
        setHasLoaded(true);
        console.log(data.results);
      }
      catch (error) {
        setErrors(errors);
      }
    }
    fetchContacts();
  }, [])

  return (
    // Apply some styling if displaying in single page mode
    <div
      className={
        singlePage ? singlePageStyles : undefined
      }
    >
      <h2>Contacts</h2>
      {
        hasLoaded ? (
          <div className="inline-block w-4/5">
        {
          contacts?.results?.map((contact) => {
            return <Contact contact={contact} />
          })
        }
      </div>
        ) : (
          <Spinner />
        )
      }
      
    </div>
  )
}

export default Contacts