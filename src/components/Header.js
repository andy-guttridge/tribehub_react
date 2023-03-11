import axios from 'axios';
import React, { useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import NotficationsMenu from './NotficationsMenu';

function Header() {
  // State variables for current user details
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  // State variables for errors
  const [errors, setErrors] = useState({});

  // Handle sign-out with API
  const handleSignout = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      setErrors({});
    } catch (error) {
      setErrors({ logout: 'There was an issue signing out of your account. You may be offline or a server error may have occurred.' })
    }
  }

  return (
    <header id="Header" className="bg-base-100 mx-auto my-0 lg:mb-2 lg:mx-2 lg:rounded-lg lg:border lg:border-base-300">
      <NavLink to="/tribe-home">
        <h1 className="md:text-6xl">
          <span className="text-primary">Tribe</span><span className="text-secondary">Hub</span>
        </h1>
      </ NavLink>
      {
        // Show welcome and sign-out button if user is authenticated
        currentUser && (
          <>
            <span className="mx-2">Welcome, {currentUser.display_name}</span>
            <NotficationsMenu />
            <NavLink to="/" onClick={handleSignout}><button className="btn btn-outline btn-xs m-2" type="button" id="signout-button">Sign-out</button></NavLink>
          </>
        )
      }

      {/* Display alert if there was an signing out */}
      {
        errors.logout &&
        <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
          <div>
            <InfoCircle size="32" className="m-auto" />
          </div>
          <div>
            <p>{errors.logout}</p>
          </div>
        </div>
      }
    </header>
  )
}

export default Header