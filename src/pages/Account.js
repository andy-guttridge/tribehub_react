import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../contexts/CurrentUserContext'
import { useSinglePage } from '../contexts/SinglePageContext';
import TribeMember from '../components/TribeMember';
import Spinner from '../components/Spinner';
import { PlusCircle } from 'react-bootstrap-icons';
import TribeMemberDetailsForm from '../components/TribeMemberDetailsForm';

function Account() {
  // Hooks for current user, changing current page location, checking if app is in single page mode
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const singlePage = useSinglePage();

  // State variables for members of the user's tribe, whether the component has loaded and whether user
  // is in the process of adding a new user.
  const [tribe, setTribe] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isAddingNewMember, setIsAddingNewMember] = useState(false);

  // Styles to apply if app is in single page mode
  const singlePageStyles = "basis-4/5 border-solid border-2 flex-none m-2"

  // Handler to respond to the add new member button by toggling the state
  const handleNewMemberButton = () => {
    setIsAddingNewMember(!isAddingNewMember);
  } 
  
  // Use effect has isAddingNewMember in dependency array, to ensure component reloads
  // when the user has finished adding a new user
  useEffect(() => {
    // Check if user logged in on mount, if not redirect to landing page
    !currentUser && navigate("/");
    
    // Fetch tribe members
    const fetchTribe = async () => {
      try {
        const { data } = await axios.get('tribe/');
        setTribe(data);
        setHasLoaded(true);
      }
      catch (error) {
        console.log(error.response?.data);
      }
    }
    fetchTribe();
  }, [isAddingNewMember])

  return (
    // Apply some styling if displaying in single page mode
    <div
      className={
        (singlePage ? singlePageStyles : undefined)
      }
    >
      <h2>Account</h2>
      {/* List members of tribe if user is tribe admin */}
      {currentUser?.is_admin &&
        <>
          <h3>Your tribe</h3>
          {/* We do not include the user in the list */}
          {hasLoaded ? (
            // If there is only one user in the tribe, it must be the tribe admin so show a prompt to add more users.
            tribe.results[0].users.length > 1 ? (
              tribe.results[0]?.users.map(tribeMember => (
                (currentUser.pk !== tribeMember.user_id) && 
                (<TribeMember key={tribeMember.user_id} tribeMember={tribeMember} />)
              ))
            ) : (
              <p className="m-2">It's looking a bit empty! Click the add button to add a member to your tribe.</p>
            )
          ) : (
            <Spinner />
          )}
          {/* Show button to add new user or the component with the form to add a new user depending on state variable */}
          <div className="justify-end flex w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">
            {
              !isAddingNewMember ? (
                <button onClick={handleNewMemberButton}><PlusCircle size="32" /></button>
              ) : (
                <TribeMemberDetailsForm handleNewMemberButton={handleNewMemberButton}/>
              )
            }
          </div>
        </>
      }
    </div>
  )
}

export default Account