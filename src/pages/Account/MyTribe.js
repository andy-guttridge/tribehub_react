import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { InfoCircle, PlusCircle } from 'react-bootstrap-icons';

import { useCurrentUser } from '../../contexts/CurrentUserContext'
import ConfirmModal from '../../components/ConfirmModal';
import TribeMember from './TribeMember';
import Spinner from '../../components/Spinner';
import TribeMemberDetailsForm from './TribeMemberDetailsForm';
import { axiosReq } from '../../api/axiosDefaults';

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

  // State variable to confirm whether a change to data was successful
  const [actionSucceeded, setActionSucceeded] = useState('');

  // State variable to trigger data reload if a change has been made to tribemembers
  const [tribeChangeFlag, setTribeChangeFlag] = useState(false);

  // State variables for errors
  const [errors, setErrors] = useState({});

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
      await axiosReq.delete(`accounts/user/${isDeletingMember}`);
      setTribeChangeFlag(!tribeChangeFlag);
      setErrors({});
      setActionSucceeded('The tribe member has been deleted');
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors({ delete: 'There was an error attempting to delete this tribe member.\n\nYou may be offline or there may have been a server error.' })
      }
    }
    setIsDeletingMember(false);
  }

  // Use effect has isAddingNewMember and isDeletingNewMember in dependency array, to ensure component reloads
  // when the user has finished adding a new user or deleting a user
  useEffect(() => {
    // Check if user logged in on mount, if not redirect to landing page
    !currentUser && navigate('/');

    // Fetch tribe members
    const fetchTribe = async () => {
      try {
        const { data } = await axiosReq.get('tribe/');
        setTribe(data);
        setHasLoaded(true);
        setErrors({});
      } catch (error) {
        if (error.response?.status !== 401) {
          setErrors({ tribe: 'There was an error fetching your tribe members from the server.\n\nYou may be offline or there may have been a server error.' })
        }
      }
    }
    fetchTribe();
  }, [tribeChangeFlag, currentUser, navigate])

  // Set timeout to get rid of any success alert
  useEffect(() => {
    const hideSuccess = setTimeout(() => {
      setActionSucceeded('');
    }, 5000);

    // Cleanup
    return () => { clearTimeout(hideSuccess) }
  }, [actionSucceeded]);

  return (
    <section className="bg-base-200">
      <div className="bg-base-100">
        <h3>My tribe</h3>
      </div>

      {/* Show button to add new user or the component with the form to add a new user depending on state variable */}
      {/* We have to pass handleNewMemberButton to the form component so that it can set the isAddingNewMember state back to false */}
      <div className="justify-end lg:justify-start flex mx-auto m-0 bg-base-100">
        {
          !isAddingNewMember ? (
            <button
              onClick={handleNewMemberButton}
              className="btn btn-ghost"
              type="button"
              id="add-new-tribe-btn"
            >
              <PlusCircle size="32" className="text-primary" /><span className="sr-only">Add new tribe member</span>
            </button>
          ) : (
            <TribeMemberDetailsForm tribeChangeFlag={() => setTribeChangeFlag(!tribeChangeFlag)} handleNewMemberButton={handleNewMemberButton} setActionSucceeded={setActionSucceeded} />
          )
        }
      </div>

      {/* Display alert with success message if a request resulting in change of data succeeded */}
      {
        actionSucceeded !== '' &&
        <div className="fixed w-full h-full top-0 left-0 z-10">
          <div className="alert alert-success justify-start w-3/4 md:w-1/2 lg:w-1/2 mx-auto mt-14">
            <div>
              <InfoCircle size="32" /><span>{actionSucceeded}</span>
            </div>
          </div>
        </div>
      }

      {/* We do not include the user in the list */}
      {hasLoaded ? (
        // If there is only one user in the tribe, it must be the tribe admin so show a prompt to add more users.
        tribe.results[0]?.users.length > 1 ? (
          tribe.results[0].users.map(tribeMember => (
            (currentUser.pk !== tribeMember.user_id) &&
            (<TribeMember key={tribeMember.user_id} tribeMember={tribeMember} handleDeleteButton={handleDeleteButton} />)
          ))
        ) : !isAddingNewMember && (
          <div className="alert alert-info justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
            <div>
              <p className="m-2 font-bold">{`It's looking a bit empty! Click the add button to add a member to your tribe.`}</p>
            </div>
          </div>
        )
      ) : (
        <div className="bg-base-100 m-0 p-2">
          <Spinner />
        </div>
      )}

      <div className="flex justify-center">
        {/* Display alert if there was an issue deleting a tribe member */}
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

        {/* Display alert if there was an issue fetching tribe members */}
        {
          errors.tribe &&
          <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
            <div>
              <InfoCircle size="32" />
            </div>
            <div>
              <p>{errors.tribe}</p>
            </div>
          </div>
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
    </section>
  )
}

export default MyTribe