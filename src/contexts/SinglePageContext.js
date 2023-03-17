import React, { createContext, useContext, useMemo, useState } from 'react'

export const SinglePageContext = createContext();
export const useSinglePage = () => useContext(SinglePageContext);

/** 
 * Provides a true or false depending on whether the window width is above or below
 * a specific breakPoint. Provides context for child components to determine whether to render
 * as single page app or separate pages, using the useSinglePage hook.
 */
export const SinglePageProvider = ({ children }) => {

  const [singlePage, setSinglePage] = useState(false);
  const breakPoint = 768;

  // Technique for using an event listener to store the current window size in
  // state variables is from 
  // https://stackoverflow.com/questions/62954765/how-to-do-conditional-rendering-according-to-screen-width-in-react

  // useMemo because it runs before children are mounted. Add event handler, set initial state and
  // provide clean-up function to remove event handler.
  useMemo(() => {
    const handleResizeWindow = () => {
      setSinglePage(window.innerWidth >= breakPoint);
    }
    window.addEventListener('resize', handleResizeWindow);
    setSinglePage(window.innerWidth >= breakPoint);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, [])

  return (
    <SinglePageContext.Provider value={singlePage}>
      {children}
    </SinglePageContext.Provider>
  )
}
