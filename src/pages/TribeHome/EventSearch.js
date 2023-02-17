import React from 'react'

function EventSearch( {handleCancelButton} ) {
  return (
    <div className="basis-full">
      <h3>Search events</h3>
      <button onClick={handleCancelButton} className="btn btn-outline">Cancel</button>
    </div>
  )
}

export default EventSearch