import React from 'react'

function Avatar({ imageUrl, large, small, accepted, displayName }) {
  /** Render three different size avatars depending on large, small or no size prop.
   * @param {string} imageUrl URL for image to be displayed
   * @param {boolean} large Render large sized avatar if true
   * @param {boolean} accepted Render greyed out Avatar if false
   * @param {string} displayName Display name for image alt tag
 */

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