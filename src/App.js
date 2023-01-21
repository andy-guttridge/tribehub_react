import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './api/axiosDefaults'

import Signin from './pages/Signin'
import TribeHome from './pages/TribeHome';
import Contacts from './pages/Contacts';
import Account from './pages/Account';
import NavBar from './components/NavBar';
import Header from './components/Header';
import { useCurrentUser } from './contexts/CurrentUserContext';
import Landing from './pages/Landing';
import Register from './pages/Register';
import SinglePage from './pages/SinglePage';


function App() {
  // Technique for using an event listener to store the current window size in
  // state variables is from 
  // https://stackoverflow.com/questions/62954765/how-to-do-conditional-rendering-according-to-screen-width-in-react
  // State variables for current width of window
  const [width, setWidth] = useState(window.innerWidth);
  const breakPoint = 1024;

  // Hook to check the current URL
  const currentUrl = useLocation();
  
  // When mounted, set event listener to check for window being resized
  // and update state when it is. Clean up event listener when unmounted.
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, [])

  const currentUser = useCurrentUser();
  return (
    <div className="App">
      <Header />
      {
        // If window width less than large breakpoint, display mobile navbar and separate pages
        width < breakPoint ?
          (
            <>
              <NavBar />
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
              {!currentUser && (currentUrl.pathname !== "/") && <Landing />}
            </>
          )
      }

    </div>
  );
}

export default App;
