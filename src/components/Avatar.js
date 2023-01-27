import React from 'react'

function Avatar({ imageUrl, large }) {
  return (
    <div className="avatar m-4 inline">
      <div className={(large ? "w-40" : "w-20") + " rounded-full"}>
        <img src={imageUrl}></img>
      </div>
    </div>
  )
}

export default Avatar