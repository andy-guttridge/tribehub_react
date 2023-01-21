import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../contexts/CurrentUserContext'

function Landing() {

  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  // Check if user logged in on mount, if yes redirect to tribe-home
  useEffect ( () => {
    currentUser && navigate("/tribe-home")
  }, [])

  return (
    <div>
      {/* Show sign-in button if user is not authenticated */}
      {!currentUser && <NavLink to={"/register"}><button className="btn btn-outline btn-wide m-2">Register</button></NavLink>}
      {!currentUser && <NavLink to={"/sign-in"}><button className="btn btn-ghost m-2">Sign-in</button></NavLink>}
      <h2>Landing Page Placeholder</h2>
    </div>
  )
}

export default Landing