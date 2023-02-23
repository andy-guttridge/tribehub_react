import React, { useEffect, useRef, useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons';
import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import { useCurrentUser, useSetCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../../components/Avatar';
import Spinner from '../../components/Spinner';

function ProfileForm() {

  // Reference to current user
  const currentUser = useCurrentUser();

  // Use useRef hook to maintain a reference to the form file upload element
  const imageInput = useRef(null);

  // State variables for editable profile data;
  const [profileData, setProfileData] = useState({
    display_name: '',
    image: '',
  });

  const { display_name, image } = profileData;

  // State variables for HTTP errors from the API
  const [errors, setErrors] = useState({});

  // State variable to confirm the profile change request was successful
  const [requestSucceeded, setRequestSucceeded] = useState(false);

  // State variable to confirm whether data has loaded;
  const [hasLoaded, setHasLoaded] = useState(false);

  // Change handler for profile form
  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value
    })
  };

  // Change handler for profile image form element. Use revokeObjectURL to destroy reference to previous profile image
  // and createObjectURL to create a new one from the form element.
  const handleImageChange = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setProfileData({
        ...profileData,
        image: URL.createObjectURL(event.target.files[0])
      });
    }
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create new form data and append the current display_name value.
    const formData = new FormData();
    formData.append('display_name', display_name);

    // Check if the user has uploaded a new image. If not, then the existing image stays in place,
    // as the form  component won't have an image file. If yes, append to form data.
    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    // Attempt to upload the new form data.
    try {
      setHasLoaded(false);
      await axiosReq.put(`/profile/${currentUser.pk}/`, formData);
      setHasLoaded(true);
      setRequestSucceeded(true);
      setErrors({});
    }
    catch (err) {
      // console.log(err)
      // A 401 error will be handled by our axios interceptor, so only set the error data if its a different error.
      if (err.response?.status !== 401) {
        setErrors(err.response?.data)
        setHasLoaded(true);
        setRequestSucceeded(false);
      }
    }
  }

  // Fetch user's profile data on mount and update state variables with 
  // fetched data, or errors if not successful
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosRes.get(`profile/${currentUser.pk}/`);
        const { display_name, image } = data;
        setProfileData({ display_name, image });
        setHasLoaded(true);
      }
      catch (error) {
        if (error.response?.status !== 401) {
          setErrors(error.response?.data)
          setHasLoaded(true);
        }
      }
    }
    fetchProfile();
  }, [])

  return (
    <div className="basis-full">
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
            />
          </label>

          {/* Display alert with any display_name field errors */}
          {
            errors.display_name &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.display_name}</span>
            </div>
          }

          {/* Profile image  */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="image">
            <span>Profile image:</span>
            <input type="file" className="file-input file-input-bordered w-full" onChange={handleImageChange} accept="image/*" ref={imageInput} />
          </ label>
          <div className="flex justify-center">
            <Avatar imageUrl={image} large />
          </div>

          {/* Display alert with any image field errors */}
          {
            errors.image &&
            <div className="alert alert-warning justify-start mt-4 mb-4">
              <InfoCircle size="32" /><span>{errors.image}</span>
            </div>
          }

          <button className="btn btn-wide">Submit</button>

          {/* Display alert with any non-field errors */}
          {
            errors.non_field_errors?.map((error, i) => (
              <div className="alert alert-warning justify-start mt-4" key={`profile_form_non-field_err${i}`}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            ))
          }

          {/* Display alert with success message if the request succeeded */}
          {
            requestSucceeded && 
              <div className="alert alert-success justify-start mt-4">
                <InfoCircle size="32" /><span>Profile updated</span>
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