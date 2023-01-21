import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../contexts/CurrentUserContext'

function Account(props) {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const { singlePage } = props;

  // Check if user logged in on mount, if not redirect to landing page
  useEffect(() => {
    !currentUser && navigate("/");
  }, [])

  return (
    // Apply some styling if displaying in single page mode
    <div
      className={
        singlePage
        && "basis-4/5 border-solid border-2 flex-none m-2"
      }
    >
      <h2>Account</h2>
    </div>
  )
}

export default Account