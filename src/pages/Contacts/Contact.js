import React, { useState } from 'react'
import { PencilSquare, Trash3 } from 'react-bootstrap-icons'

import { useCurrentUser } from '../../contexts/CurrentUserContext'
import ContactDetailsForm from './ContactDetailsForm';

// Component for individual contact
function Contact({ contact, didSaveContact, setDidSaveContact, handleDeleteButton }) {

  // Reference to current user
  const currentUser = useCurrentUser();

  // State variable to flag if user is currently editing the contact
  const [isEditingContact, setIsEditingContact] = useState();

  return (
    <div className="card rounded-sm my-2 text-center bg-base-100">
      {/* Display ContactDetailsForm if user is editing a contact */}
      {isEditingContact &&
        <ContactDetailsForm
          handleCancelButton={() => setIsEditingContact(false)}
          isEditingContact
          contact={contact}
          didSaveContact={didSaveContact}
          setDidSaveContact={setDidSaveContact}
        />
      }
      <div className="flex justify-end">
        {/* Show delete and edit buttons if user is tribe admin */}
        {
          currentUser.is_admin &&
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setIsEditingContact(true)}
              type="button"
            >
              <PencilSquare size="26" className="text-primary" />
              <span className="sr-only">Edit contact</span>
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => handleDeleteButton(contact.id)}
              type="button"
            >
              <Trash3 size="26" className="text-primary"></Trash3>
              <span className="sr-only">Delete contact</span>
            </button>
          </>
        }
      </div>

      {/* Display contact details */}
      <div className="card-body grid grid-cols-1 md:grid-cols-2 text-left break-words">
        <div>
          <p>{contact.title} {contact.first_name} {contact.last_name}</p>
          <p>{contact.company}</p>
          <p>{contact.category}</p>
        </div>
        <div>
          <p><span className="font-bold">Tel: </span>{contact.phone}</p>
          <p><span className="font-bold">Email: </span>{contact.email}</p>
        </div>
      </div>
    </div>
  )
}

export default Contact