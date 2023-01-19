import React from 'react'
import { NavLink } from 'react-router-dom'
import { useCurrentUser } from '../contexts/CurrentUserContext'

function Landing() {

  const currentUser = useCurrentUser();

  return (
    <div>
      {!currentUser && <NavLink to={"/sign-in"}><button className="btn btn-outline btn-wide">Sign-in</button></NavLink>}
      <h2>Landing Page Placeholder</h2>
    </div>
  )
}

export default Landing