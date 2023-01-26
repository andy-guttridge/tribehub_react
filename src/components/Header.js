import axios from 'axios';
import React from 'react'
import { NavLink } from 'react-router-dom';
import { axiosRes } from '../api/axiosDefaults';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';

function Header(A) {
  // State variables for current user details
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  
  // Handle sign-out with API
  const handleSignout = async (event) => {
    try {
      await axiosRes.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    }
    catch(error) {
      console.log(error)
    };
  }
  

  return (
    <div className="">
      <h1 className="md:text-6xl">TribeHub</h1>
        {
          // Show welcome and sign-out button if user is authenticated
          currentUser && (
            <>
          <span className="mr-4">Welcome, {currentUser.display_name}</span>
          <NavLink to="/" onClick={handleSignout}><button className="btn btn-outline btn-xs">Sign-out</button></NavLink>
          </>
          )
        }
    </div>
  )
};

export default Header