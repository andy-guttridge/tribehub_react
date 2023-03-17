import React from 'react'

import spinnerImage from '../assets/fidget-spinner.svg'

/**
 * Loading spinner
 * @component
 * @param {obj} obj Props object
 * @param {boolean} obj.small If true, render a smaller spinner
 */
function Spinner({ small }) {
  return (
    <div className="flex justify-center align-center m-10">
      <img src={spinnerImage} className={`animate-spin FidgetSpinner ${small ? "w-12" : "w-24"}`} alt="Data loading" />
    </div>
  )
}

export default Spinner