import React from 'react'

function Signin() {
  return (
    <>
      <h2 className="mb-4">Sign-in</h2>
      <div className="flex justify-center">
        <div className="form-control w-3/4 md:w-1/2 lg:w-1/2">
          <form>
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="username">
              <span>Username:</span>
              <input type="text" placeholder="username" className="input input-bordered w-full" id="username" />
            </label>
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="password">
              <span>Password:</span>
              <input type="text" placeholder="password" className="input input-bordered w-full" id="password" />
            </label>
            <button className="btn btn-outline w-full">Submit</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signin