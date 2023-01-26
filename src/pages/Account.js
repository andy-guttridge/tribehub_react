import React from 'react'

import { useCurrentUser } from '../contexts/CurrentUserContext'
import { useSinglePage } from '../contexts/SinglePageContext';
import MyTribe from '../components/MyTribe';

function Account() {
  // Hooks for current user, changing current page location, checking if app is in single page mode
  const currentUser = useCurrentUser();
  const singlePage = useSinglePage();

  // Styles to apply if app is in single page mode
  const singlePageStyles = "basis-4/5 border-solid border-2 flex-none m-2";  

  return (
    // Apply some styling if displaying in single page mode
    <div
      className={
        (singlePage ? singlePageStyles : undefined)
      }
    >
      <h2>Account</h2>
      {/* Show members of the user's tribe if they are tribe admin */}
      {currentUser?.is_admin && <MyTribe />}
    </div>
  )
}

export default Account