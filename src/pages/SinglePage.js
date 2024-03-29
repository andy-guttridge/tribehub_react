import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import TribeHome from './tribehome/TribeHome'
import Contacts from './contacts/Contacts'
import Account from './account/Account'
import { useCurrentUser } from '../contexts/CurrentUserContext'

/**
 * Show components that are separate pages for mobile in a single page
 * @component
 */
function SinglePage() {
  // Current user and hook for redirection
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  // Check if user logged in on mount, if not redirect to landing page
  useEffect(() => {
    !currentUser && navigate('/');
  }, [currentUser, navigate])

  return (
    // Use the components we display as separate pages for mobile embedded in one single
    // page.
    <div className="grid grid-cols-2 m-1 mt-0 items-start bg-base-200">
      <TribeHome />
      <Contacts />
      <Account />
    </div>
  )
}

export default SinglePage