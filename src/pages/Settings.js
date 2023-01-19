import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../contexts/CurrentUserContext'

function Settings() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  
  // Check if user logged in on mount, if not redirect to landing page
  useEffect( () => {
    !currentUser && navigate("/");
    console.log('Settings.js mounted')
  }, [])
  
  return (
    <div>
      <h2>Settings</h2>
    </div>
  )
}

export default Settings