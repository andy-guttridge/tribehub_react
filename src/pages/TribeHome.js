import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../contexts/CurrentUserContext'

function TribeHome() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  
  // Check if user logged in on mount, if not redirect to landing page
  useEffect( () => {
    !currentUser && navigate("/")
  }, [])
  
  return (
    <div>
      <h2>Home</h2>
    </div>
  )
}

export default TribeHome