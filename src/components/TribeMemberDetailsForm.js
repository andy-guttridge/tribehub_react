import React, { useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons';

import { axiosReq } from '../api/axiosDefaults';

function TribeMemberDetailsForm({ handleNewMemberButton }) {

  // State variables for registration form submission data
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    password2: ''
  });

    // State variables for HTTP errors from the API
  const [errors, setErrors] = useState({});

    // Retrieve required form data from state variables
    const { username, password, password2 } = registerData;
  
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
      await axiosReq.post('/accounts/user/', registerData);
      handleNewMemberButton();
    }
    catch (error) {
      setErrors(error.response?.data);
    };
  };

  return (
    <div className="basis-full">
      <h3>Add tribe member</h3>
      {/* Registration form */}
      <form onSubmit={handleSubmit}>

        {/* Username */}
        <p>Pick a user name and password for their account</p>
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
        <div>
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
        </div>

        {/* Display alert with any password2 errors */}
        {
          errors.password2 &&
          <div className="alert alert-warning justify-start mt-4 mb-4">
            <InfoCircle size="32" /><span>{errors.password2}</span>
          </div>
        }
        <button className="btn btn-outline m-2}" type="button" onClick={handleNewMemberButton}>Cancel</button>
        <button className="btn btn-outline w-1/3 m-2" type="submit">Submit</button>
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
  )
}

export default TribeMemberDetailsForm