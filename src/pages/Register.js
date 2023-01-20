import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InfoCircle } from 'react-bootstrap-icons';

import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';

function Register() {

  // State variables for registration form submission data
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    password2: '',
    tribename: ''
  });

  // State variables for HTTP errors from the API
  const [errors, setErrors] = useState({});

  // Use to redirect when registered
  const navigate = useNavigate();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  // Retrieve username and password from the state variables
  const { username, password, password2, tribename } = registerData;

  // Change handler for sign-in form
  const handleChange = (event) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value
    })
  };

  // Event handler for sign-in form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/accounts/tribe/', registerData);
      navigate("/sign-in");
    }
    catch (error) {
      setErrors(error.response?.data)
    };
  };

  // Redirect to tribe homepage if user is authenticated
  useEffect(() => {
    currentUser && navigate("/tribe-home")
  }, [currentUser])


  return (
    <>
      <h2>Register</h2>
      {/* Flex container for page content */}
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

            {/* Display alert with any username errors */}
            {
              errors.username &&
              <div className="alert alert-warning justify-start mt-4 mb-4">
                <InfoCircle size="32" /><span>{errors.username}</span>
              </div>
            }

            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="password">
              <span>Password:</span>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </label>

            {/* Display alert with any password errors */}
            {
              errors.password &&
              <div className="alert alert-warning justify-start mt-4 mb-4">
                <InfoCircle size="32" /><span>{errors.password}</span>
              </div>
            }

            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="password2">
              <span>Password 2:</span>
              <input
                type="password"
                placeholder="Re-enter password"
                className="input input-bordered w-full"
                id="password2"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </label>

            {/* Display alert with any password2 errors */}
            {
              errors.password2 &&
              <div className="alert alert-warning justify-start mt-4 mb-4">
                <InfoCircle size="32" /><span>{errors.password2}</span>
              </div>
            }

            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="tribename">
              <span>Tribe name:</span>
              <input
                type="text"
                placeholder="Tribe name"
                className="input input-bordered w-full"
                id="tribename"
                name="tribename"
                value={tribename}
                onChange={handleChange}
              />
            </label>

            {/* Display alert with any tribename errors */}
            {
              errors.tribename &&
              <div className="alert alert-warning justify-start mt-4 mb-4">
                <InfoCircle size="32" /><span>{errors.tribename}</span>
              </div>
            }

            <button className="btn btn-outline w-full">Submit</button>
          </form>

          {/* Display alert with any non-field errors */}
          {
            errors.non_field_errors?.map((error) => (
              <div className="alert alert-warning justify-start mt-4">
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            ))
          }

        </div>
      </div>
    </>
  )
}

export default Register