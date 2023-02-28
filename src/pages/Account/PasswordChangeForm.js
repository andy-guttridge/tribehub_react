import React, { useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons';

import { axiosReq } from '../../api/axiosDefaults';
import Spinner from '../../components/Spinner';

function PasswordChangeForm() {

  // State variable to confirm whether data has loaded;
  const [hasLoaded, setHasLoaded] = useState(true);

  // State variables for password form fields
  const [passwordFormData, setPasswordFormData] = useState({
    new_password1: '',
    new_password2: '',
    old_password: ''
  });

  // State variables for HTTP errors from the API
  const [errors, setErrors] = useState({});

  // State variable to confirm the password change request was successful
  const [requestSucceeded, setRequestSucceeded] = useState(false);

  // Change handler for password form
  const handleChange = (event) => {
    setPasswordFormData({
      ...passwordFormData,
      [event.target.name]: event.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setHasLoaded(false);
      await axiosReq.post('/dj-rest-auth/password/change/', passwordFormData);
      // Clear the form
      setPasswordFormData({
        new_password1: '',
        new_password2: '',
        old_password: ''
      })
      setRequestSucceeded(true);
      setHasLoaded(true);
      setErrors({});
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors(error.response?.data)

        // Clear the form
        setPasswordFormData({
          new_password1: '',
          new_password2: '',
          old_password: ''
        })
        setHasLoaded(true);
        setRequestSucceeded(false);
      }
    };
  };

  return (
    <div className="w-4/5 m-auto text-center">
      {hasLoaded ? (

        // Password change form
        <form onSubmit={handleSubmit}>

          {/* New password 1 */}
          <label className="input-group max-lg:input-group-vertical mb-4 text-left" htmlFor="new_password1">
            <span>New password:</span>
            <input
              type="password"
              placeholder="New password"
              className="input input-bordered w-full"
              id="new_password1"
              name="new_password1"
              value={passwordFormData.new_password1}
              onChange={handleChange}
            />
          </label>

          {/* Display alert with any new_password1 field errors */}
          {
            errors.new_password1 &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.new_password1}</span>
            </div>
          }

          {/* New password 2 */}
          <label className="input-group max-lg:input-group-vertical mb-4 text-left" htmlFor="new_password2">
            <span>Re-enter new password:</span>
            <input
              type="password"
              placeholder="Re-enter new password"
              className="input input-bordered w-full"
              id="new_password2"
              name="new_password2"
              value={passwordFormData.new_password2}
              onChange={handleChange}
            />
          </label>

          {/* Display alert with any new_password2 field errors */}
          {
            errors.new_password2 &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.new_password2}</span>
            </div>
          }

          {/* Old password */}
          <label className="input-group max-lg:input-group-vertical mb-4 text-left" htmlFor="old_password">
            <span>Old password:</span>
            <input
              type="password"
              placeholder="Old password"
              className="input input-bordered w-full"
              id="old_password"
              name="old_password"
              value={passwordFormData.old_password}
              onChange={handleChange}
            />
          </label>

          {/* Display alert with any old_password field errors */}
          {
            errors.old_password &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.old_password}</span>
            </div>
          }

          <button className="btn btn-primary btn-wide" type="submit">Submit</button>

          {/* Display alert with any non-field errors */}
          {
            errors.non_field_errors?.map((error, i) => (
              <div className="alert alert-warning justify-start mt-4" key={`password_change_non-field_err${i}`}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            ))
          }

          {/* Display alert with success message if the request succeeded */}
          {
            requestSucceeded && 
              <div className="alert alert-success justify-start mt-4">
                <InfoCircle size="32" /><span>Password updated</span>
              </div>
          }

        </form>
      ) : (
        <Spinner />
      )}

    </div>
  )
}

export default PasswordChangeForm