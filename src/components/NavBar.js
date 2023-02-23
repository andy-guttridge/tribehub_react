import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { House, PersonVcard, PersonGear } from 'react-bootstrap-icons'
import { useCurrentUser } from '../contexts/CurrentUserContext'

function NavBar() {
  
  // Reference to current url
  const location = useLocation();

  // Reference to current user
  const currentUser = useCurrentUser();
  
  // Icons for Navbar. Use current url to apply the active class to the correct Navlink component
  const navBarIcons = (
    <>
      <NavLink  to="/tribe-home" className={location.pathname !== '/account' && location.pathname !=='/contacts' && 'active'}>
        <House size="32" aria-label="Home" />
        <span className="sr-only">Home</span>
      </NavLink>

      <NavLink to="/contacts" className={location.pathname == '/contacts' && 'active'}>
        <PersonVcard size="32" aria-label="Contacts" />
        <span className="sr-only">Contacts</span>
      </NavLink>

      <NavLink to="/account" className={location.pathname == '/account' && 'active'}>
        <PersonGear size="32" aria-label="Account" />
        <span className="sr-only">Account</span>
      </NavLink>
    </>
  );

  return (
    <div>
      {/* Display navBarIcons only if current user is logged in */}
      {currentUser && 
        <>
          {/* Bottom NavBar for mobile */}
          <div className="btm-nav lg:hidden">
            {navBarIcons}
          </div>
        </>
      }
    </div>
  );
};

export default NavBar;