import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import { InfoCircle } from 'react-bootstrap-icons';

import { setTokenTimestamp } from "../utils/utils";
import { axiosRes } from '../api/axiosDefaults';

/**
 * Sign-in page
 * @component
 */
function Signin() {
  // State for sign-in form submission data
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = signInData;

  // Errors
  const [errors, setErrors] = useState({});

  // Use to redirect on login
  const navigate = useNavigate();

  // Current user
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const handleChange = (event) => {
    /**
     * Handle changes to sign-in form
     */
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value
    })
  };

  const handleSubmit = async (event) => {
    /**
     * Event handler for sign-in form submission
     */
    event.preventDefault();
    try {
      const { data } = await axiosRes.post('/dj-rest-auth/login/', signInData);
      setCurrentUser(data.user)
      setTokenTimestamp(data);
      navigate('/tribe-home');
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  };

  useEffect(() => {
    /**
     * Redirect to tribe homepage if user is authenticated
     */
    currentUser && navigate('/tribe-home')
  }, [currentUser, navigate])

  return (
    <div className="bg-base-100">
      <h2 className="mb-4">Sign-in</h2>

      {/* Flex container for page content */}
      <div className="flex justify-center">

        {/* Sign-in form  */}
        {/* All validation is handled by the API for this form */}

        {/* User name */}
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

            {/* Password */}
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
            <button className="btn btn-primary w-full" type="submit" id="sign-in-submit-btn">Submit</button>
          </form>

          {/* Display alert with any sign-in non-field errors */}
          {
            errors.non_field_errors?.map((error, idx) => (
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={idx}>
                <div>
                  <InfoCircle size="32" />
                </div>
                <div>
                  <p>{error}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Signin