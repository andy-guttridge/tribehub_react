import React from 'react'
import { NavLink } from 'react-router-dom'
import { House, PersonVcard, Gear, PersonGear } from 'react-bootstrap-icons'
import { useCurrentUser } from '../contexts/CurrentUserContext'

function NavBar() {

  const navBarIcons = (
    <>
      <NavLink to="/tribe-home"><House size="32" className="lg:mx-2" aria-label="Home" /><span className="sr-only lg:not-sr-only lg:inline lg:mr-24">Home</span></NavLink>
      <NavLink to="/contacts"><PersonVcard size="32" className="lg:mx-2" aria-label="Contacts" /><span className="sr-only lg:not-sr-only lg:inline lg:mr-24">Contacts</span></NavLink>
      <NavLink to="/account"><PersonGear size="32" className="lg:mx-2" aria-label="Account" /><span className="sr-only lg:not-sr-only lg:inline">Account</span></NavLink>
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
          <div className="navbar hidden lg:flex justify-center">
            {navBarIcons}
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;