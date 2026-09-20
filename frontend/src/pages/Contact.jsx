import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    message: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Contact form submitted:', formData);

    navigate('/');
  };

  return (
    <div className="contact-page">
      <h1>Contact Me</h1>

      <p>
        If you would like to get in touch, please fill out the form below.
      </p>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p><strong>Name:</strong> Gyubin Mun</p>
          <p><strong>Email:</strong> gmun@my.centennialcollege.ca</p>
          <p><strong>Location:</strong> Toronto, Ontario</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;