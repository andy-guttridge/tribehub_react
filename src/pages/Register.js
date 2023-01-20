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

  // Retrieve required form data from state variables
  const { username, password, password2, tribename } = registerData;

  // Change handler for registration form
  const handleChange = (event) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value
    })
  };

  // Event handler for registration form submission.
  // Redirects to sign-in page after successful form submission
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
      <div className="flex flex-col items-center">
        <div className="card card-bordered w-3/4 md:w-1/2 lg:w-1/2 mb-4">
          <div className="card-body">
          <h3>Register your tribe here!</h3>
          <ul className="list-disc text-left">
          <li>You will be the chief of the tribe.</li>
          <li>You can add more members to your tribe when you have registered your account and signed in.</li>
          </ul>
          </div>
        </div>

        <div className="form-control w-3/4 md:w-1/2 lg:w-1/2 text-left">
          {/* Registration form */}
          <form onSubmit={handleSubmit}>

            {/* Username */}
            <p>Pick a user name and password for your account</p>
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="username">
              <span>Username:</span>
              <input
                type="text"
                placeholder="Username"
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
            
            {/* Password */}
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
            
            {/* Password 2 */}
            <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="password2">
              <span>Re-enter password:</span>
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

            {/* Tribename */}
            <p>You will be the chief, so pick a name for your tribe!</p>
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