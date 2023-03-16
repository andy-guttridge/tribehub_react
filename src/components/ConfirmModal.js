import React, { useEffect } from 'react'

import styles from '../styles/ConfirmModal.module.css'

function ConfirmModal({ heading, body, cancelHandler, confirmHandler }) {
  /** 
   * Reusable modal dialog component
   * @param {string} heading Text for modal heading
   * @param {string} body Text for modal body
   * @param {function} cancelHandler Handler function for cancel button
   * @param {function} confirmHandler Jandler function for confirm button
   }}
   */

  // Create event listener to close modal when user clicks outside modal, and clean-up when component unmounts
  useEffect(() => {
    // Handler to identify if user has clicked outside modal and remove it if so
    const handleOutsideClick = (event) => {
      if (event.target.matches('.modal')) {
        cancelHandler();
      }
    }

    // Find instance of modal and add event listener
    const modalOuter = document.getElementsByClassName('modal')[0];
    modalOuter.addEventListener('click', (handleOutsideClick));

    // Cleanup
    return () => { modalOuter.removeEventListener('click', handleOutsideClick) }
  }, [cancelHandler])

  return (
    <div className="modal modal-open">
      <div className="modal-box text-center">
        <h3>{heading}</h3>
        <p className={`text-center ${styles.ModalBodyTxt}`}>{body}</p>
        <button
          className="btn btn-outline btn-sm m-2"
          onClick={cancelHandler}
          id="modal-cancel"
        >
          Cancel
        </button>
        <button
          className="btn btn-warning btn-sm m-2"
          onClick={confirmHandler}
          id="modal-confirm"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export default ConfirmModal