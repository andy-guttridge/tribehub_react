import React from 'react'
import { Trash3 } from 'react-bootstrap-icons'
import { useCurrentUser } from '../../contexts/CurrentUserContext'

// Component for individual contact
function Contact({ contact, handleDeleteButton }) {

  // Reference to current user
  const currentUser = useCurrentUser();

  return (
    <div className="card border-b-2 rounded-sm m-2 text-center">
      <div className="flex justify-start">
        {/* Show delete contact button if user is tribe admin */}
        {
          currentUser.is_admin &&
          <button className="btn btn-ghost"
            onClick={() => handleDeleteButton(contact.id)}
          >
            <Trash3 size="26"></Trash3>
            <span className="sr-only">Delete contact</span>
          </button>
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