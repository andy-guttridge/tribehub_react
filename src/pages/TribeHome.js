import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../contexts/CurrentUserContext'
import { useSinglePage } from '../contexts/SinglePageContext';

function TribeHome() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const singlePage = useSinglePage();

  // Styles to apply if app is in single page mode
  const singlePageStyles = "basis-4/5 border-solid border-2 flex-none m-2"
  
  // Check if user logged in on mount, if not redirect to landing page
  useEffect( () => {
    !currentUser && navigate("/")
  }, [])
  
  return (
    // Apply some styling if displaying in single page mode
    <div
      className={
        singlePage ? singlePageStyles : undefined
      }
    >
      <h2>Home</h2>
    </div>
  )
}

export default TribeHome