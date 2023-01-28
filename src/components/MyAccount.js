import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext'
import ConfirmModal from './ConfirmModal';
import DeleteAccountButton from './DeleteAccountForm';
import ProfileForm from './ProfileForm';

function MyAccount() {

  // Ref to useNavigate hook for redidrection
  const navigate = useNavigate();

  // Reference to current user
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();


  // State variable to confirm whether data has loaded;
  const [hasLoaded, setHasLoaded] = useState(false);

  // State variable to track whether user is currently in the process of deleting their account
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Check if user logged in on mount, if not redirect to landing page
  useEffect(() => {
    !currentUser && navigate("/landing-page/")
  }, [currentUser])

  // Handle user confirm they want to delete their account
  const doDeleteAccount = async () => {
    try {
      await axiosReq.delete(`accounts/user/${currentUser.pk}/`);
      setCurrentUser(null);
      navigate('/')
    }
    catch (error) {
      console.log(error.response?.data);
    }
  }

  // Toggle isDeletingAccount state - triggered by button, unset by dismissal of modal
  const handleDeleteAccountBtn = () => {
    setIsDeletingAccount(true);
  }

  return (
    <>
      <h3>My Account</h3>
      <h3>My Profile</h3>
      <div className="justify-center flex w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">
        <ProfileForm />
      </div>
      <h3>Delete Account</h3>
      <div className="block m-4">
        <div className="md:w-2/3 text-left m-auto">
          <p>This is a permanent action and can't be undone.</p>
          {currentUser?.is_admin && <p>Deleting your account will also delete all those of all your tribe members and the tribe itself.</p>}
        </div>
      </div>
      < DeleteAccountButton handleDeleteAccountBtn={handleDeleteAccountBtn} />
      {
        isDeletingAccount &&
        <ConfirmModal
          heading="Delete account"
          body={
            currentUser.is_admin ? (
              "Are you sure you want to delete your user account and all those of your tribe members?\n\n This action cannot be undone."
            ) : (
              "Are you sure you want to delete your user account? This action cannot be undone."
            )
          }
          cancelHandler={() => setIsDeletingAccount(false)}
          confirmHandler={doDeleteAccount}
        />
      }
    </>
  )
}

export default MyAccount