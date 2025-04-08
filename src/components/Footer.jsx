import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>We are a school committed to providing quality education and fostering a love for learning.</p>
          </div>
          <div className="col-md-4">
            <h5>Contact</h5>
            <p>Email: info@school.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <a href="#" className="text-white me-2">Facebook</a>
            <a href="#" className="text-white me-2">Twitter</a>
            <a href="#" className="text-white">Instagram</a>
          </div>
        </div>
        <div className="text-center mt-3">
          <p>&copy; 2023 School Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
