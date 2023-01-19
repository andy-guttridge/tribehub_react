import React from 'react'
import { NavLink } from 'react-router-dom'
import { House, PersonVcard, Gear } from 'react-bootstrap-icons'
import { useCurrentUser } from '../contexts/CurrentUserContext'

function NavBar() {

  const navBarIcons = (
    <>
      <NavLink to="/tribe-home"><House size="32" className="lg:mx-2" aria-label="Home" /><span className="hidden lg:inline">Home</span></NavLink>
      <NavLink to="/contacts"><PersonVcard size="32" className="lg:mx-2" aria-label="Contacts" /><span className="hidden lg:inline">Contacts</span></NavLink>
      <NavLink to="/settings"><Gear size="32" className="lg:mx-2" aria-label="Settings" /><span className="hidden lg:inline">Settings</span></NavLink>
    </>
  );

  // State variable for current user details
  const currentUser = useCurrentUser();

  return (
    <>
      {/* Display navBarIcons only if current user is logged in */}
      {currentUser && (
        <>
          {/* Bottom NavBar for mobile */}
          <div className="btm-nav lg:hidden">
            {navBarIcons}
          </div>
          {/* Top NavBar for large breakpoint and above */}
          <div className="navbar hidden lg:flex justify-around">
            {navBarIcons}
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;