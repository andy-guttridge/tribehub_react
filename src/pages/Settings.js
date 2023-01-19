import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../contexts/CurrentUserContext'

function Settings() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  
  // Check if user logged in on mount, if not redirect to landing page
  useEffect( () => {
    if (!currentUser){
      navigate("/")
    }
  },[])
  
  return (
    <div>
      <h2>Settings</h2>
    </div>
  )
}

export default Settings