import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-5">
      <div className="container">
        <div className="row text-start flex justify-content-between">
          {/* School Logo and Description */}
          <div className="col-md-4 mb-4">
            <div className="footer-logo mb-4 d-flex align-items-center">
              <img 
                src="/logo.png" 
                alt="School Logo" 
                className="img-fluid"
                style={{ maxHeight: '80px' }}
              />
              <div className='ms-3'>
                <h3>SS Public School</h3>
                <p className="mb-0">An Educational Institution</p>
              </div>
            </div>
            <p className="mb-4">
              We are committed to providing quality education and fostering a love for learning. 
              Our mission is to nurture young minds and prepare them for a bright future.
            </p>
            <div className="social-links">
              <a href="#" className="text-white me-3 social-icon">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white me-3 social-icon">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white me-3 social-icon">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white social-icon">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="text-uppercase mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none footer-link">
                  <i className="bi bi-house-door me-2"></i>Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-white text-decoration-none footer-link">
                  <i className="bi bi-info-circle me-2"></i>About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/principal-message" className="text-white text-decoration-none footer-link">
                  <i className="bi bi-person-badge me-2"></i>Principal's Message
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/admission" className="text-white text-decoration-none footer-link">
                  <i className="bi bi-pencil-square me-2"></i>Admission
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/Infrastructure" className="text-white text-decoration-none footer-link">
                  <i className="bi bi-building me-2"></i>Infrastructure
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/staff" className="text-white text-decoration-none footer-link">
                  <i className="bi bi-people me-2"></i>Our Staff
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/gallery" className="text-white text-decoration-none footer-link">
                  <i className="bi bi-images me-2"></i>Gallery
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none footer-link">
                  <i className="bi bi-telephone me-2"></i>Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4 text-white">
            <h5 className="text-uppercase mb-4">Contact Info</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a 
                  href="https://g.co/kgs/aoGLb9s" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="d-flex align-items-center text-decoration-none text-white footer-link"
                >
                  <i className="bi bi-geo-alt-fill me-3"></i>
                  <span>Chaunspur road, Yaqutganj, Farrukhabad, Uttar Pradesh - 209749</span>
                </a>
              </li>
              <li className="mb-3">
                <a 
                  href="tel:+919415808804" 
                  className="d-flex align-items-center text-decoration-none text-white footer-link"
                >
                  <i className="bi bi-telephone-fill me-3"></i>
                  <span>+91 94158 08804</span>
                </a>
              </li>
              <li className="mb-3">
                <a 
                  href="mailto:sspublicschool@gmail.com" 
                  className="d-flex align-items-center text-decoration-none text-white footer-link"
                >
                  <i className="bi bi-envelope-fill me-3"></i>
                  <span>sspublicschool@gmail.com</span>
                </a>
              </li>
            </ul>
            <div className="newsletter mt-4">
              <h5 className="text-uppercase mb-3">Newsletter</h5>
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control newsletter-input text-white" 
                  placeholder="Your Email" 
                />
                <button className="btn btn-primary newsletter-btn" type="button">
                  <i className="bi bi-arrow-right-square"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-top pt-4">
              <p className="mb-2 mb-md-0 text-start">
                2017 - {new Date().getFullYear()}  &copy;  SS Public School. All rights reserved.
              </p>
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
                <Link to="/privacy-policy" className="text-white text-decoration-none footer-link">
                  Privacy Policy
                </Link>
                <span className="d-none d-md-inline">|</span>
                <Link to="/developer-info" className="text-white text-decoration-none footer-link">
                  Developer Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
