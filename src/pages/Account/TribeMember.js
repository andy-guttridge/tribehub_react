import React from 'react'
import { Trash3 } from 'react-bootstrap-icons'

import Avatar from '../../components/Avatar'

function TribeMember({ tribeMember, handleDeleteButton }) {
  /**
   * Details of individual tribe member
   * @param {object} tribeMember Tribe member to be displayed
   * @param {function} handleDeleteButton Handler for delete button on each tribe member
   */

  return (
    <>
      <div className="rounded-sm grid grid-cols-2 mb-0.5 bg-base-100">
        <div className="flex col-start-1 col-span-1 justify-content-between">

          {/* Avatar for tribe member */}
          <Avatar imageUrl={tribeMember.profile_image} displayName={tribeMember.display_name}/>
          <span className="basis-1 m-2 min-w-[50%] break-all text-left">{tribeMember.display_name}</span>
        </div>

        {/* Delete button for tribe member */}
        <div className="grid col-start-2 col-span-1 justify-end">
          <button
            className="m-4 btn btn-ghost"
            onClick={() => handleDeleteButton(tribeMember.user_id)}
            type="button"
            id={`tribe-member-delete-btn-${tribeMember.user_id}`}
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