import React from 'react'

function Contact({ contact }) {
  return (
    <div className="card border-b-2 rounded-sm m-2 text-center">
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