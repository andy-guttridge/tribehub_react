import { Navigate, Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';

import './App.css';
import './api/axiosDefaults';
import Signin from './pages/Signin';
import TribeHome from './pages/tribehome/TribeHome';
import Contacts from './pages/contacts/Contacts';
import Account from './pages/account/Account';
import NavBar from './components/NavBar';
import Header from './components/Header';
import { useCurrentUser } from './contexts/CurrentUserContext';
import Landing from './pages/Landing';
import Register from './pages/Register';
import SinglePage from './pages/SinglePage';
import { useSinglePage } from './contexts/SinglePageContext';
import css from './styles/App.module.css';


function App() {
  // Hook to provide current user context
  const currentUser = useCurrentUser();

  // Hook to provide context on whether to display in single page mode
  const singlePage = useSinglePage();
  
  // Set body element to use the lightmode theme if the user isn't logged in using the DaisyUI data-theme attribute
  useEffect (() => {
    if (!currentUser) {
      document.body.setAttribute ('data-theme', 'tribehub_theme');
      document.body.style.height = '100vh';
    }

    // Clean-up function to remove the data-theme attribute and set the body back to 100% height
    return () => {
      document.body.removeAttribute('data-theme');
      document.body.style = '100%';
    }
  }, [currentUser]);

  return (
    <div className={`App ${css.AppStyles} m-auto md:bg-base-200`} data-theme={!currentUser && "tribehub_theme"}>
      <Header />
      {
        // If window width less than medium breakpoint, display mobile navbar and separate pages
        !singlePage ?
          (
            <>
              <Routes>
                <Route exact path="/" element={
                  currentUser ? (
                    <TribeHome />
                  ) : (
                    <Landing />
                  )
                }
                />
                <Route exact path="/sign-in" element={<Signin />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/tribe-home" element={<TribeHome />} />
                <Route exact path="/contacts" element={<Contacts />} />
                <Route exact path="/account" element={<Account />} />

                {/* If URL not successfully resolved, direct to TribeHome if logged in, */}
                {/* otherwise, redirect to the landing page. */}
                {/* How to use Navigate component for this purpose is from */}
                {/* https://www.copycat.dev/blog/react-router-redirect/ */}
                <Route path="*" element={<Navigate to={currentUser ? "tribe-home" : "/"} />}/>
              </Routes>            
              <NavBar />
            </>
          ) : (
            // If window width larger than medium breakpoint, use single page app layout
            <>
              <Routes>
                <Route exact path="/" element={
                  currentUser ? (
                    <SinglePage />
                  ) : (
                    <Landing />
                  )
                }
                />
                <Route exact path="/sign-in" element={<Signin />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/tribe-home" element={<SinglePage />} />
                <Route exact path="/contacts" element={<SinglePage />} />
                <Route exact path="/account" element={<SinglePage />} />

                {/* If URL not successfully resolved, direct to SinglePage if logged in, */}
                {/* otherwise, redirect to the landing page. */}
                {/* How to use Navigate component for this purpose is from */}
                {/* https://www.copycat.dev/blog/react-router-redirect/ */}
                <Route path="*" element={<Navigate to={currentUser ? "tribe-home" : "/"} />}/>
              </Routes>
            </>
          )
      }

    </div>
  );
}

export default App;
