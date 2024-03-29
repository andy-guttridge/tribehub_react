import React, { useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons';

import { axiosReq } from '../../api/axiosDefaults';
import css from '../../styles/TribeMemberDetailsForm.module.css'

/**
 * Form for tribe admin to add a new tribe member
 * @component
 * @param {object} obj Props
 * @param {function} obj.tribeChangeFlag Callback to let the parent know a tribe member's state has changed
 * @param {function} obj.handleNewMemberButton Callback to let parent know the request to add a new tribe member has been dealt with
 * @param {function} obj.setActionSucceeded Set parent state to let it know an action to change data succeeded
 */
function TribeMemberDetailsForm({ tribeChangeFlag, handleNewMemberButton, setActionSucceeded }) {
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
      tribeChangeFlag();
      setActionSucceeded('The new member was added to your tribe');
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  };

  return (
    <div className={`w-4/5 md:w-full m-auto md:mx-2 ${css.TribeMemberFormExpand}`}>
      <h3>Add tribe member</h3>

      {/* Form to add tribe members */}
      {/* All validation is handled by the API for this form  */}
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
          <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
            <div>
              <InfoCircle size="32" />
            </div>
            <div>
              <p>{errors.password2}</p>
            </div>
          </div>
        }
        <button className="btn btn-outline m-2}" type="button" id="add-tribe-member-cancel-btn" onClick={handleNewMemberButton}>Cancel</button>
        <button className="btn btn-primary w-1/3 m-2" type="submit" id="add-tribe-member-submit-btn">Submit</button>
      </form>

      {/* Display alert with any non-field errors */}
      {
        errors.non_field_errors?.map((error, i) => (
          <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`tribemember_form_non-field_err${i}`}>
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
  )
}

export default TribeMemberDetailsForm