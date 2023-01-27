import React from 'react'

function DeleteAccountButton({ handleDeleteAccountBtn }) {
  return (
    <>
      <button className="btn btn-wide m-4" onClick={handleDeleteAccountBtn}>Delete</button>
    </>
  )
}

export default DeleteAccountButton