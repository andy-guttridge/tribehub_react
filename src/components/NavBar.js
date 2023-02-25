import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { House, PersonVcard, PersonGear } from 'react-bootstrap-icons'

import { useCurrentUser } from '../contexts/CurrentUserContext'

function NavBar() {
  
  // Reference to current url
  const location = useLocation();

  // Reference to current user
  const currentUser = useCurrentUser();
  
  // Icons for bottom navbar (only used for breakpoints below large). Use current url to apply the active class to the correct Navlink component
  const navBarIcons = (
    <>
      <NavLink  to="/tribe-home" className={location.pathname !== '/account' && location.pathname !=='/contacts' && 'active'}>
        <House size="32" aria-label="Home" />
        <span className="sr-only">Home</span>
      </NavLink>

      <NavLink to="/contacts" className={location.pathname === '/contacts' && 'active'}>
        <PersonVcard size="32" aria-label="Contacts" />
        <span className="sr-only">Contacts</span>
      </NavLink>

      <NavLink to="/account" className={location.pathname === '/account' && 'active'}>
        <PersonGear size="32" aria-label="Account" />
        <span className="sr-only">Account</span>
      </NavLink>
    </>
  );

  return (
    <div className="btm-nav text-primary lg:hidden">
      {/* Display navBarIcons only if current user is logged in */}
      {currentUser && 
        <>
          {/* Bottom NavBar for mobile */}
            {navBarIcons}
        </>
      }
    </div>
  );
};

export default NavBar;