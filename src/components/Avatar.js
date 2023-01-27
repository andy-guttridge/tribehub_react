import React from 'react'

function Avatar({ imageUrl }) {
  return (
    <div className="avatar m-4 inline">
      <div className="w-20 rounded-full">
        <img src={imageUrl}></img>
      </div>
    </div>
  )
}

export default Avatar