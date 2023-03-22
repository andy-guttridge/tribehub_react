import React from 'react'

/**
 * Delete button for deleting user account
 * @component
 */
function DeleteAccountButton({ handleDeleteAccountBtn }) {
  return (
    <>
      <button className="btn btn-warning btn-wide m-4" onClick={handleDeleteAccountBtn} id="delete-account-btn">Delete</button>
    </>
  )
}

export default DeleteAccountButton