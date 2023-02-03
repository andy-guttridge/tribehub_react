import React from 'react'
import { Trash3 } from 'react-bootstrap-icons'
import Avatar from '../../components/Avatar'

function TribeMember({ tribeMember, handleDeleteButton }) {

  return (
    <div className="border-b-2 rounded-sm grid grid-cols-2 w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">
      <div className="flex col-start-1 justify-content-between">
        <Avatar imageUrl={tribeMember.profile_image} />
        <span className="basis-1 m-2" aria-label="Name of tribe member">{tribeMember.display_name}</span>
      </div>
      <div className="grid col-start-2 justify-end">
        <button
          className="m-4"
          aria-label="Delete tribe member"
          onClick={() => handleDeleteButton(tribeMember.user_id)}>
          <Trash3 size="32"></Trash3>
        </button>
      </div>
    </div>
  )
}

export default TribeMember