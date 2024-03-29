import React from 'react'

import { useCurrentUser } from '../../contexts/CurrentUserContext'
import { useSinglePage } from '../../contexts/SinglePageContext';
import MyTribe from './MyTribe';
import MyAccount from './MyAccount';

/**
 * Overall account page/section
 * @component
 */
function Account() {
  // Hooks for current user, checking if app is in single page mode
  const currentUser = useCurrentUser();
  const singlePage = useSinglePage();

  // Styles to apply if app is in single page mode
  const singlePageStyles = 'basis-4/5 border border-base-300 rounded-lg flex-none mr-2 mt-2 md:mx-0.5 md:mt-0.5 bg-base-100';

  return (
    // Apply some styling if displaying in single page mode
    <section
      className={
        (singlePage ? singlePageStyles : "bg-base-100")
      }
    >
      <h2>Account</h2>
      {/* Show members of the user's tribe if they are tribe admin */}
      {currentUser?.is_admin && <MyTribe />}
      <MyAccount />
    </section>
  )
}

export default Account