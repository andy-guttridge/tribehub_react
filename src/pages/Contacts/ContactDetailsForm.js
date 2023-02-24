import React, { useEffect, useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons';

import { axiosReq } from '../../api/axiosDefaults';

function ContactDetailsForm({ handleCancelButton, didSaveContact, setDidSaveContact, isEditingContact, contact }) {

  // State variables for form values
  const [contactForm, setContactForm] = useState({
    category: '',
    company: '',
    title: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
  })

  // Retrieve form data from state variables
  const { category, company, title, first_name, last_name, phone, email } = contactForm;

  // State variables for errors
  const [errors, setErrors] = useState({});

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If user is editing an existing contact, make changes using PUT method,
    // otherwise create a new contact with POST method
    try {
      if (isEditingContact) {
        await axiosReq.put(`contacts/${contact.id}/`, contactForm);
      } else {
        await axiosReq.post('contacts/', contactForm);
      }
      // Hide form and tell parent component the contact was saved
      handleCancelButton();
      setDidSaveContact(!didSaveContact);
      setErrors({});
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors(error.response?.data);
      }
    }
  }

  // Handle changes in form values
  const handleChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    })
  }

  // Set form values using contact details passed in if user is editing an existing contact
  useEffect(() => {
    if (isEditingContact) {
      setContactForm(contact);
    }
  }, [isEditingContact, setContactForm, contact])

  return (
    <div className="w-4/5 m-auto">
      <h3>Add contact</h3>
      <form onSubmit={handleSubmit}>

        {/* The value from the API for each form input is or'd with an empty string, as the API can return null values which cause errors in React */}
        {/* Category field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="category">
          <span>Category:</span>
          <input
            type="text"
            className="input input-bordered w-full"
            id="category"
            name="category"
            value={category || ''}
            onChange={handleChange}
          />
        </label>

        {/* Display alert with any category field errors */}
        {
          errors?.category?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-4" key={`category-err${i}`}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            )
          })
        }

        {/* Company field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="company">
          <span>Company:</span>
          <input
            type="text"
            className="input input-bordered w-full"
            id="company"
            name="company"
            value={company || ''}
            onChange={handleChange}
          />
        </label>

        {/* Display alert with any company field errors */}
        {
          errors?.company?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-4" key={`company-err${i}`}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            )
          })
        }

        {/* Title field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="title">
          <span>Title:</span>
          <input
            type="title"
            className="input input-bordered w-full"
            id="title"
            name="title"
            value={title || ''}
            onChange={handleChange}
          />
        </label>

        {/* Display alert with any title field errors */}
        {
          errors?.title?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-4" key={`title-err${i}`}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            )
          })
        }

        {/* First name field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="first_name">
          <span>First name:</span>
          <input
            type="text"
            className="input input-bordered w-full"
            id="first_name"
            name="first_name"
            value={first_name || ''}
            onChange={handleChange}
          />
        </label>

        {/* Display alert with any first name field errors */}
        {
          errors?.first_name?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-4" key={`first_name-err${i}`}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            )
          })
        }

        {/* Last name field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="last_name">
          <span>Last name:</span>
          <input
            type="text"
            className="input input-bordered w-full"
            id="last_name"
            name="last_name"
            value={last_name || ''}
            onChange={handleChange}
          />
        </label>

        {/* Display alert with any last name field errors */}
        {
          errors?.last_name?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-4" key={`last_name-err${i}`}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            )
          })
        }

        {/* Phone number field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="phone">
          <span>Telephone number:</span>
          <input
            type="tel"
            className="input input-bordered w-full"
            id="phone"
            name="phone"
            value={phone || ''}
            onChange={handleChange}
          />
        </label>

        {/* Display alert with any phone number field errors */}
        {
          errors?.phone?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-4" key={`phone-err${i}`}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            )
          })
        }

        {/* Email field */}
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="email">
          <span>Email:</span>
          <input
            type="email"
            className="input input-bordered w-full"
            id="email"
            name="email"
            value={email || ''}
            onChange={handleChange}
          />
        </label>

        {/* Display alert with any email field errors */}
        {
          errors?.email?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-4" key={`email-err${i}`}>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            )
          })
        }

        {/* Cancel and submit buttons */}
        <button className="btn btn-outline" onClick={handleCancelButton} type="button">Cancel</button>
        <button className="btn btn-outline w-1/3 m-2" type="submit">Submit</button>

        {/* Display alert with any non-field errors */}
        {
          errors?.non_field_errors?.map((error, i) => (
            <div className="alert alert-warning justify-start mt-4" key={`contact-nonfield-err${i}`}>
              <InfoCircle size="32" /><span>{error}</span>
            </div>
          ))
        }

      </form>
    </div>
  )
}

export default ContactDetailsForm