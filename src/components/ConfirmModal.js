import React from 'react'

function ConfirmModal({ heading, body, cancelHandler, confirmHandler }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3>{heading}</h3>
        <p>{body}</p>
        <button
          className="btn btn-outline btn-sm m-2"
          onClick={cancelHandler}
        >
          Cancel
        </button>
        <button
          className="btn btn-outline btn-sm m-2"
          onClick={confirmHandler}
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export default ConfirmModal