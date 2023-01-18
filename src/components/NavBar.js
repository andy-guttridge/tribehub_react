import React from 'react'
import { NavLink } from 'react-router-dom'
import { House, PersonVcard, Gear } from 'react-bootstrap-icons'

function NavBar() {
  return (
    <>
      {/* Bottom NavBar for mobile */}
      <div className="btm-nav lg:hidden">
        <NavLink to="/"><House size="32"/></NavLink>
        <NavLink to="/"><PersonVcard size="32"/></NavLink>
        <NavLink to="/"><Gear size="32" /></NavLink>
      </div>

      {/* Top NavBar for large breakpoint and above */}
      <div className="navbar hidden lg:flex justify-around">
        <NavLink to="/"><House size="32" className="mx-2"/>Home</NavLink>
        <NavLink to="/"><PersonVcard size="32" className="mx-2"/>Contacts</NavLink>
        <NavLink to="/"><Gear size="32" className="mx-2"/>Settings</NavLink>
      </div>
    </>
  )
}

export default NavBar