import React from 'react'
import { Trash3 } from 'react-bootstrap-icons'

import Avatar from '../../components/Avatar'

function TribeMember({ tribeMember, handleDeleteButton }) {

  return (
    <>
      <div className="rounded-sm grid grid-cols-2 my-1 lg:my-0 lg:mb-1 bg-base-100">
        <div className="flex col-start-1 justify-content-between">

          {/* Avatar for tribe member */}
          <Avatar imageUrl={tribeMember.profile_image} displayName={tribeMember.display_name}/>
          <span className="basis-1 m-2">{tribeMember.display_name}</span>
        </div>

        {/* Delete button for tribe member */}
        <div className="grid col-start-2 justify-end">
          <button
            className="m-4 btn btn-ghost"
            onClick={() => handleDeleteButton(tribeMember.user_id)}
            type="button"
          >
            <Trash3 size="28" className="text-primary"></Trash3>
            <span className="sr-only">Delete {tribeMember.display_name} from tribe</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default TribeMember