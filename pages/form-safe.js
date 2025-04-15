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

  const handleResponse = (status, msg) => {
    if (status === 200) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg }
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } else {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: msg }
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));
    
    try {
      const res = await fetch('/api/contact-safe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const text = await res.text();
      const json = text ? JSON.parse(text) : {}
      
      handleResponse(res.status, json.message);
    } catch (error) {
      handleResponse(500, 'Error submitting form: ' + error.message);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <h1>Contact Us (Safe Mode)</h1>
      <p className={styles.safeNotice}>
        This form uses a fallback API that works without MongoDB.
        Use this while you're troubleshooting database issues.
      </p>
      
      {status.submitted ? (
        <div className={styles.successMessage}>
          <h3>Thank you!</h3>
          <p>Your message has been received (in safe mode). {status.info.msg}</p>
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
      
      <div className={styles.diagnosticLinks}>
        <p>Troubleshooting:</p>
        <ul>
          <li><a href="/mongo-helper.html">MongoDB Connection Helper</a></li>
          <li><a href="/api/diagnose-mongo">Run MongoDB Diagnostics</a></li>
          <li><a href="/api/test-db">Test Database Connection</a></li>
        </ul>
      </div>
    </div>
  );
} 