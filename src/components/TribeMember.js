import React from 'react'
import { Trash3 } from 'react-bootstrap-icons'

function TribeMember({ tribeMember, handleDeleteButton }) {

  return (
    <div className="border-2 rounded-sm justify-between flex w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">
      <span className="basis-1 m-2" aria-label="Name of tribe member">{tribeMember.display_name}</span>
      <div>
        <button
          className="m-4"
          aria-label="Delete tribe member"
          onClick={() => handleDeleteButton(tribeMember.user_id)}>
          <Trash3></Trash3>
        </button>
      </div>
    </div>
  )
}

export default TribeMember