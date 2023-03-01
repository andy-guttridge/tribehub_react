import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom';

import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser, useSetCurrentUser } from '../../contexts/CurrentUserContext'
import ConfirmModal from '../../components/ConfirmModal';
import DeleteAccountButton from './DeleteAccountForm';
import PasswordChangeForm from './PasswordChangeForm';
import ProfileForm from './ProfileForm';
import {removeTokenTimestamp} from '../../utils/utils'
import { InfoCircle } from 'react-bootstrap-icons';
import { useSinglePage } from '../../contexts/SinglePageContext';

function MyAccount() {

  // Ref to useNavigate hook for redidrection
  const navigate = useNavigate();

  // Hook to determine if in single page mode
  const singlePage = useSinglePage();

  // State variables for errors
  const [errors, setErrors] = useState({})

  // Reference to current user
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  // State variable to track whether user is currently in the process of deleting their account
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Check if user logged in on mount, if not redirect to landing page.
  // Scroll to top of page if not in single page mode.
  useEffect(() => {
    !currentUser && navigate('/');
    !singlePage && window.scrollTo(0, 0);
  }, [currentUser, navigate, singlePage])

  // Handle user confirm they want to delete their account
  const doDeleteAccount = async () => {
    try {
      await axiosReq.delete(`accounts/user/${currentUser.pk}/`);
      removeTokenTimestamp();
      setCurrentUser(null);
      navigate('/');
      setErrors({});
    } catch (error) {
      if(error.response?.status !== 401) {
        setErrors({delete: 'There was a problem deleting your account. You may be offline, or a server error may have occurred.'})
        setIsDeletingAccount(false);
      }
    }
  }

  // Toggle isDeletingAccount state - triggered by button, unset by dismissal of modal
  const handleDeleteAccountBtn = () => {
    setIsDeletingAccount(true);
  }

  return (
    <>
      {/* Update profile section */}
      <h3>My Profile</h3>
      <div className="justify-center flex w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">
        <ProfileForm />
      </div>

      {/* Change password section */}
      <h3>Change password</h3>
      <div className="block m-4">
        <div className="md:w-2/3 text-left m-auto">
          <PasswordChangeForm />
        </div>
      </div>

      {/* Delete acccount section */}
      <h3>Delete Account</h3>

      {/* Display error alert if there was an issue deleting account */}
      {
      errors.delete && 
      <div className="block w-4/5 md:w-2/3 lg:1/2 mx-auto my-4 alert alert-warning">
        <InfoCircle size="32" className="m-auto"/><p>{errors.delete}</p>
      </div>
      }
      
      <div className="block m-4">
        <div className="md:w-2/3 text-left m-auto">
          <p>This is a permanent action and can't be undone.</p>
          {currentUser?.is_admin && <p>Deleting your account will also delete all those of all your tribe members and the tribe itself.</p>}
        </div>
      </div>
      < DeleteAccountButton handleDeleteAccountBtn={handleDeleteAccountBtn} />
      {
        // Technique to use ReactDOM.createPortal to add a modal to the end of the DOM body from
        // https://upmostly.com/tutorials/modal-components-react-custom-hooks
        isDeletingAccount && ReactDOM.createPortal(
          <ConfirmModal
            heading="Delete account"
            body={
              currentUser.is_admin ? (
                "Are you sure you want to delete your user account and all those of your tribe members? This action cannot be undone."
                + "\n\nIf you have another account, you will need to clear all cookies for TribeHub before you can use it to login again."
              ) : (
                "Are you sure you want to delete your user account? This action cannot be undone."
                + "\n\nIf you have another account, you will need to clear all cookies for TribeHub before you can use it to login again."
              ) 
            }
            cancelHandler={() => setIsDeletingAccount(false)}
            confirmHandler={doDeleteAccount}
          />, document.body)
      }
    </>
  )
}

export default MyAccount