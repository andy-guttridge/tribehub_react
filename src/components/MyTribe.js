import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { PlusCircle } from 'react-bootstrap-icons';

import { useCurrentUser } from '../contexts/CurrentUserContext'
import ConfirmModal from '../components/ConfirmModal';
import TribeMember from '../components/TribeMember';
import Spinner from '../components/Spinner';
import TribeMemberDetailsForm from '../components/TribeMemberDetailsForm';
import { axiosReq } from '../api/axiosDefaults';

function MyTribe() {
  // Hooks for current user, changing current page location, checking if app is in single page mode
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  // State variables for members of the user's tribe, whether the component has loaded, and whether user
  // is in the process of adding a new user.
  const [tribe, setTribe] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isAddingNewMember, setIsAddingNewMember] = useState(false);

  // State variable to confirm whether a tribe admin has selected to delete one of their tribe member's
  // accounts. If yes, this stores the user id of the user they've selected to delete.
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  // Handler to respond to the add new member button by toggling the state
  const handleNewMemberButton = () => {
    setIsAddingNewMember(!isAddingNewMember);
  }

  // Handler for delete tribe member buttons
  const handleDeleteButton = (id) => {
    setIsDeletingMember(id);
  }

  // Handler to delete a tribe member
  const doDelete = async () => {
    try {
      await axiosReq.delete(`accounts/user/${isDeletingMember}`)
    }
    catch (error) {
      console.log(error.response?.data)
    }
    setIsDeletingMember(false);
  }

  // Use effect has isAddingNewMember and isDeletingNewMember in dependency array, to ensure component reloads
  // when the user has finished adding a new user or deleting a user
  useEffect(() => {
    // Check if user logged in on mount, if not redirect to landing page
    !currentUser && navigate("/");

    // Fetch tribe members
    const fetchTribe = async () => {
      try {
        const { data } = await axiosReq.get('tribe/');
        setTribe(data);
        setHasLoaded(true);
      }
      catch (error) {
        console.log(error.response?.data);
      }
    }
    fetchTribe();
  }, [isAddingNewMember, isDeletingMember])

  return (
    <>
      <h3>My tribe</h3>
      {/* We do not include the user in the list */}
      {hasLoaded ? (
        // If there is only one user in the tribe, it must be the tribe admin so show a prompt to add more users.
        tribe.results[0].users.length > 1 ? (
          tribe.results[0]?.users.map(tribeMember => (
            (currentUser.pk !== tribeMember.user_id) &&
            (<TribeMember key={tribeMember.user_id} tribeMember={tribeMember} handleDeleteButton={handleDeleteButton} />)
          ))
        ) : (
          <p className="m-2">It's looking a bit empty! Click the add button to add a member to your tribe.</p>
        )
      ) : (
        <Spinner />
      )}
      {/* Show button to add new user or the component with the form to add a new user depending on state variable */}
      {/* We have to pass handleNewMemberButton to the form component so that it can set the isAddingNewMember state back to false */}
      <div className="justify-end flex w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">
        {
          !isAddingNewMember ? (
            <button onClick={handleNewMemberButton}><PlusCircle size="32" /></button>
          ) : (
            <TribeMemberDetailsForm handleNewMemberButton={handleNewMemberButton} />
          )
        }
      </div>

      {/* If tribe admin has selected to delete a tribeMember, show the modal to confirm or cancel */}
      {/* // Technique to use ReactDOM.createPortal to add a modal to the end of the DOM body from
          // https://upmostly.com/tutorials/modal-components-react-custom-hooks */}
      {
        isDeletingMember && ReactDOM.createPortal(
          <ConfirmModal
            heading="Delete user"
            body="Are	you sure you want to delete this user account?"
            cancelHandler={() => setIsDeletingMember(false)}
            confirmHandler={doDelete}
          />, document.body)
      }
    </>
  )
}

export default MyTribe