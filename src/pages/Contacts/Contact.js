import React, { useState } from 'react'
import { PencilSquare, Trash3 } from 'react-bootstrap-icons'

import { useCurrentUser } from '../../contexts/CurrentUserContext'
import ContactDetailsForm from './ContactDetailsForm';

// Component for individual contact
function Contact({ contact, didSaveContact, setDidSaveContact, handleDeleteButton, setActionSucceeded }) {
  /**
   * Displays details of indiviual contact
   * @param {object} contact Contact to be displayed
   * @param {boolean} didSaveContact Value from parent to be toggled to indicate when a contact was saved
   * @param {function} setDidSaveContact Set state of didSaveContact
   * @param {function} handleDeleteButton Handler for delete contact button
   * @param {function} setActionSucceeded Set state to let parent know an action resulting in change of data succeeded
   */

  // Reference to current user
  const currentUser = useCurrentUser();

  // State to flag if user is currently editing the contact
  const [isEditingContact, setIsEditingContact] = useState();

  return (
    <div className="card rounded-none md:rounded-sm mb-0.5 text-center bg-base-100">
      {/* Display ContactDetailsForm if user is editing a contact */}
      {isEditingContact &&
        <ContactDetailsForm
          handleCancelButton={() => setIsEditingContact(false)}
          isEditingContact
          contact={contact}
          didSaveContact={didSaveContact}
          setDidSaveContact={setDidSaveContact}
          setActionSucceeded={setActionSucceeded}
        />
      }

      {/* Display contact details */}
      <div className="card-body grid grid-cols-2 text-left break-words">
        <div>
          <h3 className="text-xl">{contact.category}</h3>
          <p>{contact.title} {contact.first_name} {contact.last_name}</p>
          <p>{contact.company}</p>
        </div>
        <div>
          <p><span className="font-bold">Tel: </span>{contact.phone}</p>
          <p><span className="font-bold">Email: </span>{contact.email}</p>
        </div>

        <div className="flex col-span-2 justify-end">
          {/* Show delete and edit buttons if user is tribe admin */}
          {
            currentUser.is_admin &&
            <>
              <button
                className={`btn btn-ghost ${isEditingContact && "btn-disabled"}`}
                onClick={() => setIsEditingContact(true)}
                type="button"
                id={`edit-contact-btn-${contact.id}`}
              >
                <PencilSquare size="26" className="text-primary" />
                <span className="sr-only">Edit contact</span>
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => handleDeleteButton(contact.id)}
                type="button"
                id={`delete-contact-btn-${contact.id}`}
              >
                <Trash3 size="26" className="text-primary"></Trash3>
                <span className="sr-only">Delete contact</span>
              </button>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default Contact