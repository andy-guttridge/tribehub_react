import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useCurrentUser } from '../contexts/CurrentUserContext'

function Landing() {

  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  // Check if user logged in on mount, if yes redirect to tribe-home
  useEffect ( () => {
    currentUser && navigate('/tribe-home')
  }, [currentUser, navigate])

  return (
    <div className="bg-base-100">
      
      {/* Register and sign-in buttons if user not authenticated */}
      {/* Register button */}
      {!currentUser &&
      <NavLink to={"/register"}>
        <button className="btn btn-outline btn-wide m-2" type="button">Register</button>
      </NavLink>}
      
      {/* Sign-in button */}
      {!currentUser &&
      <NavLink to={"/sign-in"}>
        <button className="btn m-2 btn-primary" type="button">Sign-in</button>
      </NavLink>}
      <h2>Landing Page Placeholder</h2>
    </div>
  )
}

export default Landing