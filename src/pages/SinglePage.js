import React, { useEffect } from 'react'

import TribeHome from './TribeHome/TribeHome'
import Contacts from './Contacts/Contacts'
import Account from './Account/Account'
import { useCurrentUser } from '../contexts/CurrentUserContext'
import { useNavigate } from 'react-router-dom'

function SinglePage() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  // Check if user logged in on mount, if not redirect to landing page
  useEffect (() => {
    !currentUser && navigate("/");
  }, [])

  return (
    // Use the components we display as separate pages for mobile embedded in one single
    // page.
    <div className="flex flex-wrap justify-center">
      <TribeHome />
      <Contacts />
      <Account />
    </div>
  )
}

export default SinglePage