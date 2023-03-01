import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import { InfoCircle } from 'react-bootstrap-icons';

import { setTokenTimestamp } from "../utils/utils";
import { axiosReq } from '../api/axiosDefaults';

function Signin() {

  // State variables for sign-in form submission data
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });

  // State variables for HTTP errors from the API
  const [errors, setErrors] = useState({});

  // Use to redirect on login
  const navigate = useNavigate();

  // References to current user
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  // Retrieve username and password from the state variables
  const { username, password } = signInData;

  // Change handler for sign-in form
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value
    })
  };

  // Event handler for sign-in form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosReq.post('/dj-rest-auth/login/', signInData);
      setCurrentUser(data.user)
      setTokenTimestamp(data);
      navigate('/tribe-home');
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    };
  };

  // Redirect to tribe homepage if user is authenticated
  useEffect(() => {
    currentUser && navigate('/tribe-home')
  }, [currentUser, navigate])

  return (
    <div className="bg-base-100">
      <h2 className="mb-4">Sign-in</h2>

      {/* Flex container for page content */}
      <div className="flex justify-center">

        {/* Sign-in form  */}
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
                type="password"
                placeholder="password"
                className="input input-bordered w-full"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </label>
            <button className="btn btn-primary w-full" type="submit">Submit</button>
          </form>

          {/* Display alert with any sign-in errors */}
          {
            errors.non_field_errors?.map((error, idx) => (
              <div className="alert alert-warning justify-start mt-4" key={idx}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Signin