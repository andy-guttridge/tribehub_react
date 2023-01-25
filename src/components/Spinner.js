import React from 'react'
import spinnerImage from '../assets/fidget_spinner_red.png'

function Spinner() {
  return (
    <div className="flex justify-center align-center m-10">
      <img src={spinnerImage} className="animate-spin w-24" />
    </div>
  )
}

export default Spinner