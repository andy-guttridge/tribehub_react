import React from 'react'

import spinnerImage from '../assets/fidget-spinner.svg'

function Spinner( {small} ) {
  return (
    <div className="flex justify-center align-center m-10">
      <img src={spinnerImage} className={`animate-spin ${small ? "w-12" : "w-24"}`} alt="Data loading"/>
    </div>
  )
}

export default Spinner