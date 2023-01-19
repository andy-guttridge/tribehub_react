import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext';

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

  const currentUser = useCurrentUser();
  
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
      const { data } = await axios.post('/dj-rest-auth/login/', signInData);
      navigate("/tribe-home");
    }
    catch(error){
      setErrors(error.response?.data)
    };
  };
  
  // Redirect to tribe homepage if user is authenticated
  useEffect(() => {
    currentUser && navigate("/tribe-home")
  }, [currentUser])

  return (
    <>
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
                type="text"
                placeholder="password"
                className="input input-bordered w-full"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </label>
            <button className="btn btn-outline w-full">Submit</button>
          </form>

        </div>
      </div>
    </>
  )
}

export default Signin