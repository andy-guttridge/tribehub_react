import React, { useEffect, useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons';

import { axiosReq } from '../../api/axiosDefaults';
import css from '../../styles/ContactDetailsForm.module.css';

function ContactDetailsForm({ handleCancelButton, didSaveContact, setDidSaveContact, isEditingContact, contact, setActionSucceeded }) {

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
        setActionSucceeded('Your changes to the contact have been saved');
      } else {
        await axiosReq.post('contacts/', contactForm);
        setActionSucceeded('Your contact has been added')
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
    <section className={`w-4/5 md:w-full m-auto ${css.ContactDetailsExpand}`}>
      {isEditingContact ? <h3>Edit Contact</h3> : <h3>Add contact</h3>}
      <form onSubmit={handleSubmit} className="md:mx-2">

        {/* The value from the API for each form input is or'd with an empty string, as the API can return null values which cause errors in React */}
        {/* Category field */}
        <p className="text-xs text-left">Use the category field to describe the nature or purpose of the contact</p>
        <label className="input-group max-lg:input-group-vertical mb-4" htmlFor="contact-category">
          <span>Category:</span>
          <input
            required
            type="text"
            className="input input-bordered w-full"
            id="contact-category"
            name="category"
            value={category || ''}
            onChange={handleChange}
            maxLength="100"
          />
        </label>

        {/* Display alert with any category field errors */}
        {
          errors?.category?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`category-err${i}`}>
                <div>
                  <InfoCircle size="32" /><span>{error}</span>
                </div>
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
            maxLength="100"
          />
        </label>

        {/* Display alert with any company field errors */}
        {
          errors?.company?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`company-err${i}`}>
                <div>
                  <InfoCircle size="32" /><span>{error}</span>
                </div>
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
            maxLength="20"
          />
        </label>

        {/* Display alert with any title field errors */}
        {
          errors?.title?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`title-err${i}`}>
                <div>
                  <InfoCircle size="32" /><span>{error}</span>
                </div>
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
            maxLength="100"
          />
        </label>

        {/* Display alert with any first name field errors */}
        {
          errors?.first_name?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`first_name-err${i}`}>
                <div>
                  <InfoCircle size="32" /><span>{error}</span>
                </div>
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
            maxLength="100"
          />
        </label>

        {/* Display alert with any last name field errors */}
        {
          errors?.last_name?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`last_name-err${i}`}>
                <div>
                  <InfoCircle size="32" /><span>{error}</span>
                </div>
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
            maxLength="50"
          />
        </label>

        {/* Display alert with any phone number field errors */}
        {
          errors?.phone?.map((error, i) => {
            return (
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`phone-err${i}`}>
                <div>
                  <InfoCircle size="32" /><span>{error}</span>
                </div>
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
              <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`email-err${i}`}>
                <div>
                  <InfoCircle size="32" /><span>{error}</span>
                </div>
              </div>
            )
          })
        }

        {/* Cancel and submit buttons */}
        <button className="btn btn-outline" onClick={handleCancelButton} type="button" id="contact-details-cancel-btn">Cancel</button>
        <button className="btn btn-primary w-1/3 m-2" type="submit" id="contact-details-submit-btn">Submit</button>

        {/* Display alert with any non-field errors */}
        {
          errors?.non_field_errors?.map((error, i) => (
            <div className="alert alert-warning justify-start mt-4 mb-2 w-3/4 md:w-1/2 lg:w-1/2 mx-auto" key={`contact-nonfield-err${i}`}>
              <div>
                <InfoCircle size="32" /><span>{error}</span>
              </div>
            </div>
          ))
        }

      </form>
    </section>
  )
}

export default ContactDetailsForm