import React from 'react'

import spinnerImage from '../assets/fidget-spinner.svg'

function Spinner({ small }) {
  /**
   * Loading spinner
   * @param {bool} small If true, render a smaller spinner
   */

  return (
    <div className="flex justify-center align-center m-10">
      <img src={spinnerImage} className={`animate-spin FidgetSpinner ${small ? "w-12" : "w-24"}`} alt="Data loading" />
    </div>
  )
}

export default Spinner