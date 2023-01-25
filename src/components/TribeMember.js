import React from 'react'
import { Pencil, Trash3 } from 'react-bootstrap-icons'

function TribeMember({ tribeMember }) {

  return (
    <div className="border-2 rounded-sm justify-between flex w-4/5 md:w-2/3 lg:1/2 mx-auto my-4">
      <span className="basis-1 m-2" aria-label="Name of tribe member">{tribeMember.display_name}</span>
      <div>
        <button className="m-4" aria-label="Edit tribe member"><Pencil></Pencil></button>
        <button className="m-4" aria-label="Delete tribe member"><Trash3></Trash3></button>
      </div>
    </div>
  )
}

export default TribeMember