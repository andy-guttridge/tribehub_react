import React, { useEffect } from 'react'

import TribeHome from './TribeHome'
import Contacts from './Contacts'
import Account from './Account'
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
    // page. Use a singlePage prop to tell the children they are being rendered in single page mode.
    <div className="flex flex-wrap justify-center">
      <TribeHome singlePage />
      <Contacts singlePage />
      <Account singlePage />
    </div>
  )
}

export default SinglePage