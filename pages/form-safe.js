import React, { useState } from 'react';
import styles from '../styles/Contact.module.css';

export default function SafeContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
    
    // Simulate form submission
    setTimeout(() => {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: 'Your message has been received.' }
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className={styles.contactContainer}>
      <h1>Contact Us</h1>
      <p className={styles.safeNotice}>
        This is a demo contact form. In a real application, this would connect to a backend service.
      </p>
      
      {status.submitted ? (
        <div className={styles.successMessage}>
          <h3>Thank you!</h3>
          <p>Your message has been received. {status.info.msg}</p>
          <button 
            className={styles.button} 
            onClick={() => setStatus({ submitted: false, submitting: false, info: { error: false, msg: null }})}>
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.button}
            disabled={status.submitting}>
            {status.submitting ? 'Sending...' : 'Send Message'}
          </button>
          
          {status.info.error && (
            <div className={styles.errorMessage}>
              <p>Error: {status.info.msg}</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
} 