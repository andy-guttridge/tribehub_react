import React, { useState } from 'react'
import axios from 'axios';

function Signin() {

  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const { username, password } = signInData;

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value
    })
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('/dj-rest-auth/login/', signInData);
    }
    catch(error){
      setErrors(error.response?.data)
    };
  };

  return (
    <>
      <h2 className="mb-4">Sign-in</h2>
      <div className="flex justify-center">
        <div className="form-control w-3/4 md:w-1/2 lg:w-1/2">
          <form onSubmit={handleSubmit}>
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="username">
              <span>Username:</span>
              <input
                  type="text"
                  placeholder="username"
                  className="input input-bordered w-full"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
            </label>
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="password">
              <span>Password:</span>
              <input
                type="text"
                placeholder="password"
                className="input input-bordered w-full"
                id="password"
                name="password"
                value={password}
                onChange={handleChange} />
            </label>
            <button className="btn btn-outline w-full">Submit</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signin