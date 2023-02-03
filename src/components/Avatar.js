import React from 'react'

function Avatar({ imageUrl, large, small }) {
  return (
    <div className={"avatar inline " + (small ? " " : "m-4")}>
      <div className={(large ? "w-40" : small ? "w-10" : "w-20") + " rounded-full"}>
        <img src={imageUrl}></img>
      </div>
    </div>
  )
}

export default Avatar