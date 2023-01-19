import axios from 'axios';
import { current } from 'daisyui/src/colors';
import React from 'react'
import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';

function Header(props) {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  
  const handleSignout = async (event) => {
    try {
      await axios.post("dj-rest-auth/logout/");
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
          currentUser && (
            <>
          <span className="mr-4">Welcome, {currentUser.username}</span>
          <NavLink to="/" onClick={handleSignout}><button className="btn btn-outline btn-xs">Sign-out</button></NavLink>
          </>
          )
        }
    </div>
  )
};

export default Header