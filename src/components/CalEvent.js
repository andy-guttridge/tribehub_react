import React from 'react'

function CalEvent( {event} ) {
  return (
    <div className="card border-2 rounded-sm w-4/5 m-2 inline-block">
      <div className="card-body">
      <p><span className="font-bold">Date:</span><span>{event.start}</span></p>
      <p><span className="font-bold">Subject:</span><span>{event.subject}</span></p>
      </div>
    </div>
  )
}

export default CalEvent