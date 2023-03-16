import React from 'react'

function DeleteAccountButton({ handleDeleteAccountBtn }) {
  /**
   * Delete button for deleting user account
   */
  return (
    <>
      <button className="btn btn-warning btn-wide m-4" onClick={handleDeleteAccountBtn} id="delete-account-btn">Delete</button>
    </>
  )
}

export default DeleteAccountButton