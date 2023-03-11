import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { InfoCircle } from 'react-bootstrap-icons';

import { useCurrentUser } from '../contexts/CurrentUserContext';
import { axiosReq } from '../api/axiosDefaults';

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
      await axiosReq.post('/accounts/tribe/', registerData);
      navigate('/sign-in');
    } catch (error) {
      setErrors(error.response?.data);
    }
  };

  // Redirect to tribe homepage if user is authenticated
  useEffect(() => {
    currentUser && navigate('/tribe-home')
  }, [currentUser, navigate])


  return (
    <div className="bg-base-100">
      <h2>Register</h2>

      {/* Flex container for page content */}
      <div className="flex flex-col items-center">
        <div className="m-2 alert alert-info w-3/4 md:w-1/2 lg:w-1/2">

          <h3>Register your tribe here!</h3>
          <div>
            <ul className="m-2 list-disc text-left">
              <li>You will be the chief of the tribe.</li>
              <li>You can add more members to your tribe when you have registered your account and signed in.</li>
            </ul>
          </div>
        </div>

        <div className="form-control w-3/4 md:w-1/2 lg:w-1/2 text-left">

          {/* Registration form */}
          {/* All validation is handled by the API for this form */}
          <form onSubmit={handleSubmit}>

            {/* Username */}
            <p className="font-bold">Pick a user name and password for your account</p>
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
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
                <div>
                  <InfoCircle size="32" />
                </div>
                <div>
                  <p>{errors.username}</p>
                </div>
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
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
                <div>
                  <InfoCircle size="32" />
                </div>
                <div>
                  <p>{errors.password}</p>
                </div>
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
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
                <div>
                  <InfoCircle size="32" />
                </div>
                <div>
                  <p>{errors.password2}</p>
                </div>
              </div>
            }

            {/* Tribename */}
            <p className="font-bold">You will be the chief, so pick a name for your tribe!</p>
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
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
                <div>
                  <InfoCircle size="32" />
                </div>
                <div>
                  <p>{errors.tribename}</p>
                </div>
              </div>
            }

            <button className="btn btn-primary w-full" type="submit" id="register-submit-btn">Submit</button>
          </form>

          {/* Display alert with any non-field errors */}
          {
            errors.non_field_errors?.map((error, i) => (
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`register-non-field-error${i}`}>
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

export default Register