import React from 'react'

function Avatar({ imageUrl, large, small, accepted }) {
  // Render three different size avatars depending on large, small or no size prop.
  // If the accepted prop is received with a value of false, grey the avatar out.
  return (
    <div className={"avatar inline " + (small ? " " : "m-4")}>
      <div
							className={(large? "w-40 " : small ? "w-10 " : "w-20 ") + 
              (accepted && "contrast-50 grayscale ")  + 
              " rounded-full"}>
        <img src={imageUrl}></img>
      </div>
    </div>
  )
}

export default Avatar