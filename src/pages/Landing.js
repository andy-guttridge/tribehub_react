import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useCurrentUser } from '../contexts/CurrentUserContext';
import css from '../styles/Landing.module.css'

function Landing() {

  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  // Check if user logged in on mount, if yes redirect to tribe-home
  useEffect(() => {
    currentUser && navigate('/tribe-home')
  }, [currentUser, navigate])

  return (
    <div className="bg-base-100 max-h-screen sm:overflow-hidden">

      {/* Register and sign-in buttons if user not authenticated */}
      {/* Register button */}
      <div>
        {!currentUser &&
          <NavLink to={"/register"}>
            <button className="btn btn-outline btn-wide m-2" type="button" id="register-btn">Register</button>
          </NavLink>}

        {/* Sign-in button */}
        {!currentUser &&
          <NavLink to={"/sign-in"}>
            <button className="btn m-2 btn-primary" type="button" id="sign-in-btn">Sign-in</button>
          </NavLink>}
      </div>
      
      {/* Outer container for landing page hero */}
      <div className={`mt-14 ${css.LandingPageTop} overflow-hidden`} >

        {/* Diagonal coloured div */}
        <div className={`${css.DiagonalBoxPrimary}`}>

          {/*  Container for text content*/}
          <div className={`${css.Content}`}>
              <p className="font-nunito mx-1 text-6xl max-[399px]:text-4xl m-auto">Your family`&apos`s calendar and contacts all in one place.</p>
          </div>
        </div>
      </div>




    </div>

  )
}

export default Landing