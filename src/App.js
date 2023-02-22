import './App.css';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './api/axiosDefaults'

import Signin from './pages/Signin'
import TribeHome from './pages/TribeHome/TribeHome';
import Contacts from './pages/Contacts/Contacts';
import Account from './pages/Account/Account';
import NavBar from './components/NavBar';
import Header from './components/Header';
import { useCurrentUser } from './contexts/CurrentUserContext';
import Landing from './pages/Landing';
import Register from './pages/Register';
import SinglePage from './pages/SinglePage';
import { useSinglePage } from './contexts/SinglePageContext';


function App() {

  // Hook to provide current user context
  const currentUser = useCurrentUser();

  // Hook to provide context on whether to display in single page mode
  const singlePage = useSinglePage();
  return (
    <div className="App">
      <Header />
      {
        // If window width less than large breakpoint, display mobile navbar and separate pages
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
                <Route path='*' element={<Navigate to={currentUser ? 'tribe-home' : '/'} />}/>
              </Routes>
              {/* Div with margin to ensure clearance above bottom navbar */}
              <div className="mb-20"></div>
              <NavBar className="z-[9999]" />
            </>
          ) : (
            // If window width larger than breakpoint, use single page app layout
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
                <Route path='*' element={<Navigate to={currentUser ? 'tribe-home' : '/'} />}/>
              </Routes>
            </>
          )
      }

    </div>
  );
}

export default App;
