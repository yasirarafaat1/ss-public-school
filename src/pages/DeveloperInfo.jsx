import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const DeveloperInfo = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
  }, []);

  return (
    <div className="py-5 mt-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-4" data-aos="fade-down">Developer Information</h1>
            
            <div className="mb-4" data-aos="zoom-in" data-aos-delay="200">
              <img 
                src="/developer.jpeg" 
                alt="Developer" 
                className="rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h2 className="h3 mb-3">Yasir Arafaat</h2>
              <p className="text-muted">Web Developer</p>
            </div>
            
            <div className="mb-5" data-aos="fade-up" data-aos-delay="400">
              <h2 className="h4 mb-3">Contact Information</h2>
              <div className="d-flex flex-column align-items-center gap-3">
                <a href="mailto:mailforarafaat@gmail.com" className="text-decoration-none" data-aos="fade-right" data-aos-delay="500">
                  <i className="bi bi-envelope-fill me-2"></i>mailforarafaat@gmail.com
                </a>
                <a href="https://wa.me/917905325078" target="_blank" rel="noopener noreferrer" className="text-decoration-none" data-aos="fade-right" data-aos-delay="600">
                  <i className="bi bi-whatsapp me-2"></i>WhatsApp Business
                </a>
                <a href="https://www.instagram.com/yasir.arafaat1?igsh=MTE4OGJuemszb3FidA==" target="_blank" rel="noopener noreferrer" className="text-decoration-none" data-aos="fade-right" data-aos-delay="700">
                  <i className="bi bi-instagram me-2"></i>Instagram
                </a>
              </div>
            </div>

            <div className="mt-4" data-aos="fade-up" data-aos-delay="800">
              <Link to="/" className="btn btn-primary">
                <i className="bi bi-arrow-left me-2"></i>Back to Home
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DeveloperInfo; 