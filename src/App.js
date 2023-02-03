import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './api/axiosDefaults'

import Signin from './pages/Signin'
import TribeHome from './pages/TribeHome/TribeHome';
import Contacts from './pages/Contacts';
import Account from './pages/Account/Account';
import NavBar from './components/NavBar';
import Header from './components/Header';
import { useCurrentUser } from './contexts/CurrentUserContext';
import Landing from './pages/Landing';
import Register from './pages/Register';
import SinglePage from './pages/SinglePage';
import { useSinglePage } from './contexts/SinglePageContext';


function App() {

  // Hook to check the current URL
  const currentUrl = useLocation();

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
              </Routes>
              {/* Div with margin to ensure clearance above bottom navbar */}
              <div className="mb-20"></div>
              <NavBar className="z-[9999]"/>
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
              </Routes>
              {/* If user is logged in and URL is something random, use SinglePage component */}
              {/* Otherwise, redirect to the landing page. */}
              {currentUser && (currentUrl.pathname !== "/") && <SinglePage />}
            </>
          )
      }

    </div>
  );
}

export default App;
