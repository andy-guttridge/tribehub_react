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
      setErrors({logout: 'There was an issue signing out of your account. You may be offline or a server error may have occurred.'})
    };
  }

  return (
    <div id="Header">
      <h1 className="md:text-6xl">TribeHub</h1>
      {
        // Show welcome and sign-out button if user is authenticated
        currentUser && (
          <>
            <span className="mx-2">Welcome, {currentUser.display_name}</span>
            <NotficationsMenu />
            <NavLink to="/" onClick={handleSignout}><button className="btn btn-outline btn-xs mx-2">Sign-out</button></NavLink>
          </>
        )
      }

      {/* Display alert if there was an signing out */}
      {
        errors.logout &&
        <div className="block alert alert-warning mx-auto my-4 w-4/5">
          <InfoCircle size="32" className="m-auto"/><p>{errors.logout}</p>
        </div>
      }
    </div>
  )
};

export default Header