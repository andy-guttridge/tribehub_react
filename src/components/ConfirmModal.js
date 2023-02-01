import React, { useEffect } from 'react'

import styles from '../styles/ConfirmModal.module.css'

function ConfirmModal({ heading, body, cancelHandler, confirmHandler }) {
  
  // Handler to identify if user has clicked outside modal and remove it if so
  const handleOutsideClick = (event) => {
    if(event.target.matches('.modal')){
      cancelHandler();
    }
  }

  // Create event listener to close modal when user clicks outside modal, and clean-up when component unmounts
  useEffect(() => {
    const modalOuter = document.getElementsByClassName('modal')[0];
    modalOuter.addEventListener('click', (handleOutsideClick));
    return () => {modalOuter.removeEventListener('click', handleOutsideClick)}
  },[])

  return (
    <div className="modal modal-open">
      <div className="modal-box text-center">
        <h3>{heading}</h3>
        <p className={`text-center ${styles.ModalBodyTxt}`}>{body}</p>
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