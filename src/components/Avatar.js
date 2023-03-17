import React from 'react'

/** Render three different size avatars depending on large, small or no size prop.
 * @component
 * @param {obj} obj Props object
 * @param {string} obj.imageUrl URL for image to be displayed
 * @param {boolean} obj.large Render large sized avatar if true
 * @param {boolean} obj.accepted Render greyed out Avatar if false
 * @param {string} obj.displayName Display name for image alt tag
*/
function Avatar({ imageUrl, large, small, accepted, displayName }) {
  return (
    <div className={"avatar inline " + (small ? " " : "m-4")}>
      <div
        className={(large ? "w-40 " : small ? "w-10 " : "w-20 ") +
          (accepted && "contrast-50 grayscale ") +
          " rounded-full"}>
        <img src={imageUrl} alt={`Avatar for ${displayName}`}></img>
      </div>
    </div>
  )
}

export default Avatar