import React, { useEffect, useRef, useState } from 'react'
import { axiosReq } from '../api/axiosDefaults';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import Spinner from './Spinner';

function ProfileForm() {

  // Reference to current user
  const currentUser = useCurrentUser();

  // Use useRef hook to maintain a reference to the form file upload element
  const imageInput = useRef(null);

  // State variable for profile data;
  const [profileData, setProfileData] = useState({
    display_name: '',
    image: '',
  });

  const { display_name, image } = profileData;

  // State variables for HTTP errors from the API
  const [errors, setErrors] = useState({});

  // State variable to confirm whether data has loaded;
  const [hasLoaded, setHasLoaded] = useState(false);

  // Change handler for profile form
  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value
    })
  };

  // Change handler for profile image form element
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
    const formData = new FormData();

    formData.append('display_name', display_name);

    // Check if the user has uploaded a new image. If not, then the existing image stays in place,
    // as the form  component won't have an image file.
    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    // We have to refresh the user's access token before we make a request to create a post, because we are uploading an image file as well as text.
    try {
      setHasLoaded(false);
      await axiosReq.put(`/profile/${currentUser.pk}/`, formData);
      setHasLoaded(true);
    }
    catch (err) {
      // console.log(err)
      // A 401 error will be handled by our axios interceptor, so only set the error data if its a different error.
      if (err.response?.status !== 401) {
        setErrors(err.response?.data)
      }
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosReq.get(`profile/${currentUser.pk}/`);
        const { display_name, image } = data;
        console.log(image)
        setProfileData({ display_name, image });
        setHasLoaded(true);
      }
      catch (error) {
        console.log(error.response?.data);
      }
    }
    fetchProfile();
  }, [])

  return (
    <div className="basis-full">
      {hasLoaded ? (
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

          {/* Profile image  */}
          <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="image">
            <span>Profile image:</span>
            <input type="file" className="file-input file-input-bordered w-full" onChange={handleImageChange} accept="image/*" ref={imageInput} />
          </ label>
          <div className="flex justify-center">
          <Avatar imageUrl={image} large />
          </div>
          <button className="btn btn-wide">Submit</button>
        </form>
      ) : (
        <Spinner />
      )}

    </div>
  )
}

export default ProfileForm