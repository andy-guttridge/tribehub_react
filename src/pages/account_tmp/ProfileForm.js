import React, { useEffect, useRef, useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons';

import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../../components/Avatar';
import Spinner from '../../components/Spinner';

/**
 * Update profile form
 * @component
 */
function ProfileForm() {
  // Current user
  const currentUser = useCurrentUser();

  // Reference to the form file upload element
  const imageInput = useRef(null);

  // State for editable profile data;
  const [profileData, setProfileData] = useState({
    display_name: '',
    image: '',
  });
  const { display_name, image } = profileData;

  // State for HTTP errors from the API
  const [errors, setErrors] = useState({});

  // State to confirm the profile change request was successful
  const [actionSucceeded, setActionSucceeded] = useState(false);

  // State to confirm whether data has loaded;
  const [hasLoaded, setHasLoaded] = useState(false);

  // Change handler for profile form
  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value
    })
  };


  const handleImageChange = (event) => {
    /**
     * Change handler for profile image form element
     */
    if (event.target.files.length) {
      // Destroy reference to previous profile image
      // and createObjectURL to create a new one from the form element
      URL.revokeObjectURL(image);
      setProfileData({
        ...profileData,
        image: URL.createObjectURL(event.target.files[0])
      });
    }
  }

  const handleSubmit = async (event) => {
    /**
     * Handle form submission
     */
    event.preventDefault();

    // Create new form data and append the current display_name value
    const formData = new FormData();
    formData.append('display_name', display_name);

    // Check if the user has uploaded a new image. If yes, append to form data
    if (imageInput?.current?.files[0]) {
      formData.append('image', imageInput.current.files[0]);
    }

    // Attempt to upload the new form data.
    try {
      setHasLoaded(false);
      await axiosReq.put(`/profile/${currentUser.pk}/`, formData);
      setHasLoaded(true);
      setActionSucceeded(true);
      setErrors({});
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors(error.response?.data)
        setHasLoaded(true);
        setActionSucceeded(false);
      }
      if (error.response?.status === 500) {
        setErrors({
          server_error: 'The server experienced an internal error'
        })
      }
    }
  }

  useEffect(() => {
    /**
     * Fetch user's profile data on mount and update state with fetched data
     */
    const fetchProfile = async () => {
      try {
        const { data } = await axiosRes.get(`profile/${currentUser.pk}/`);
        const { display_name, image } = data;
        setProfileData({ display_name, image });
        setHasLoaded(true);
      } catch (error) {
        if (error.response?.status !== 401) {
          setErrors(error.response?.data)
          setHasLoaded(true);
        }
      }
    }
    fetchProfile();
  }, [currentUser])

  useEffect(() => {
    /**
     * Set timeout and get rid of any success alert
     */
    const hideSuccess = setTimeout(() => {
      setActionSucceeded('');
    }, 5000);

    // Cleanup
    return () => { clearTimeout(hideSuccess) }
  }, [actionSucceeded]);

  return (
    <div className="justify-self-center basis-full mx-2">
      {hasLoaded ? (

        // Profile form
        <form onSubmit={handleSubmit}>

          {/* Display name */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="display_name">
            <span>Display Name:</span>
            <input
              type="text"
              className="input input-bordered w-full"
              id="display_name"
              name="display_name"
              value={display_name}
              onChange={handleChange}
              maxLength="50"
            />
          </label>

          {/* Display alert with any display_name field errors */}
          {
            errors.display_name &&
            <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
              <div>
                <InfoCircle size="32" />
              </div>
              <div>
                <p>{errors.display_name}</p>
              </div>
            </div>
          }

          {/* Profile image  */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="image">
            <span>Profile image:</span>
            <input id="image" type="file" className="file-input file-input-bordered w-full" onChange={handleImageChange} accept="image/*" ref={imageInput} />
          </ label>
          <div className="flex justify-center">
            <Avatar imageUrl={image} large />
          </div>

          {/* Display alert with any image field errors */}
          {
            errors.image &&
            <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
              <div>
                <InfoCircle size="32" />
              </div>
              <div>
                <p>{errors.image}</p>
              </div>
            </div>
          }

          <button className="btn btn-primary btn-wide" type="submit" id="profile-submit-btn">Submit</button>

          {/* Display alert with any non-field errors */}
          {
            errors.non_field_errors?.map((error, i) => (
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`profile_form_non-field_err${i}`}>
                <div>
                  <InfoCircle size="32" />
                </div>
                <div>
                  <p>{error}</p>
                </div>
              </div>
            ))
          }

          {/* Display alert if there was a 500 error */}
          {
            errors.server_error &&
            <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto">
              <div>
                <InfoCircle size="32" />
              </div>
              <div>
                <p>The server experienced an internal error. A common cause of this is uploading a file that is not an image.</p>
                <br />
                <p>If you attempted to upload a profile image, please check your file format and try again.</p>
              </div>
            </div>
          }

          {/* Display alert with success message if request succeeded */}
          {
            actionSucceeded &&
            <div className="fixed min-h-fit min-w-full top-0 left-0 z-10">
              <div className="alert alert-success justify-start w-3/4 md:w-1/2 lg:w-1/2 mx-auto mt-14">
                <div>
                  <InfoCircle size="32" />
                </div>
                <div>
                  <p>Profile updated</p>
                </div>
              </div>
            </div>
          }
        </form>
      ) : (
        <Spinner />
      )}

    </div>
  )
}

export default ProfileForm