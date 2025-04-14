import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form, Alert, Toast, ToastContainer } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import './Home.css';

const Home = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    classInterested: "",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!isOnline) {
      setToastMessage("Please check your internet connection and try again.");
      setToastVariant("danger");
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      const response = await axios.post('http://localhost:5000/api/admission/test', {
        studentName: formData.studentName,
        parentName: formData.parentName,
        email: formData.email,
        phone: formData.phone,
        classInterested: formData.classInterested,
        message: formData.message,
        status: 'pending'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response from server:', response.data);
      setToastMessage("Admission enquiry submitted successfully!");
      setToastVariant("success");
      setShowToast(true);
      setFormData({
        studentName: "",
        parentName: "",
        email: "",
        phone: "",
        classInterested: "",
        message: "",
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      let errorMessage = "Failed to submit form. Please try again.";
      
      if (err.response) {
        console.error('Error response:', err.response.data);
        errorMessage = err.response.data.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        console.error('Error request:', err.request);
        errorMessage = "No response from server. Please check if the backend is running.";
      } else {
        console.error('Error message:', err.message);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* <!-- Hero Section --> */}
      <section 
        className="hero-section d-flex align-items-center text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
          position: "relative"
        }}
      >
        <div 
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          }}
        ></div>
        <Container className="position-relative z-1 py-10">
          <Row className="justify-content-center text-center">
            <Col md={8} data-aos="fade-up">
              <h1 className="display-3 fw-bold hero-title">
                Welcome to <span className="highlight">SS Public School</span>
              </h1>
              <p className="lead hero-subtitle" data-aos="fade-up" data-aos-delay="200">
                Empowering Minds, Building Futures
              </p>
              <div className="hero-buttons" data-aos="fade-up" data-aos-delay="400">
                <Button variant="primary" size="lg" as={Link} to="/about" className="me-3">
                  Learn More
                </Button>
                <Button variant="outline-light" size="lg" as={Link} to="/admission">
                  Apply Now
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <!-- Features Section --> */}
      <section className="features-section py-5">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Why Choose Us</h2>
          <Row className="g-4">
            <Col md={4} data-aos="fade-up" data-aos-delay="100">
              <div className="feature-card text-center p-4">
                <i className="bi bi-book text-primary display-4 mb-3"></i>
                <h3>Quality Education</h3>
                <p>Our experienced faculty provides top-notch education with modern teaching methods.</p>
              </div>
            </Col>
            <Col md={4} data-aos="fade-up" data-aos-delay="200">
              <div className="feature-card text-center p-4">
                <i className="bi bi-people text-primary display-4 mb-3"></i>
                <h3>Experienced Faculty</h3>
                <p>Learn from the best educators who are passionate about teaching and mentoring.</p>
              </div>
            </Col>
            <Col md={4} data-aos="fade-up" data-aos-delay="300">
              <div className="feature-card text-center p-4">
                <i className="bi bi-building text-primary display-4 mb-3"></i>
                <h3>Modern Infrastructure</h3>
                <p>State-of-the-art facilities to support comprehensive learning and development.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <!-- About Section --> */}
      <section className="about-section py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} data-aos="fade-right">
              <img 
                src="https://subhashacademy.vercel.app/assets/front3.jpeg" 
                alt="School Building" 
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col lg={6} data-aos="fade-left">
              <h2 className="mb-4">About Our School</h2>
              <p className="lead mb-4">
                SS Public School is committed to providing quality education and fostering a love for learning.
              </p>
              <p>
                Our mission is to nurture young minds and prepare them for a bright future through innovative
                teaching methods and a supportive learning environment.
              </p>
              <Button variant="primary" as={Link} to="/about" className="mt-3">
                Learn More About Us
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <!-- Programs Section --> */}
      <section className="programs-section py-5">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Our Programs</h2>
          <Row className="g-4">
            <Col md={6} lg={3} data-aos="zoom-in" data-aos-delay="100">
              <div className="program-card text-center p-4">
                <i className="bi bi-mortarboard text-primary display-4 mb-3"></i>
                <h3>Primary Education</h3>
                <p>Building strong foundations for young learners.</p>
              </div>
            </Col>
            <Col md={6} lg={3} data-aos="zoom-in" data-aos-delay="200">
              <div className="program-card text-center p-4">
                <i className="bi bi-book text-primary display-4 mb-3"></i>
                <h3>Secondary Education</h3>
                <p>Comprehensive learning for middle school students.</p>
              </div>
            </Col>
            <Col md={6} lg={3} data-aos="zoom-in" data-aos-delay="300">
              <div className="program-card text-center p-4">
                <i className="bi bi-graph-up text-primary display-4 mb-3"></i>
                <h3>Higher Secondary</h3>
                <p>Preparing students for higher education and careers.</p>
              </div>
            </Col>
            <Col md={6} lg={3} data-aos="zoom-in" data-aos-delay="400">
              <div className="program-card text-center p-4">
                <i className="bi bi-trophy text-primary display-4 mb-3"></i>
                <h3>Extracurricular</h3>
                <p>Sports, arts, and other activities for holistic development.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* <!-- Admission Section --> */}
      <section className="admission-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Admission Process</h2>
          <Row className="g-4">
            <Col lg={6} data-aos="fade-right">
              <div className="admission-info p-4">
                <h3 className="mb-4">How to Apply</h3>
                <div className="mb-4">
                  <i className="bi bi-1-circle-fill text-primary me-3"></i>
                  <span>Fill out the admission form</span>
                </div>
                <div className="mb-4">
                  <i className="bi bi-2-circle-fill text-primary me-3"></i>
                  <span>Submit required documents</span>
                </div>
                <div className="mb-4">
                  <i className="bi bi-3-circle-fill text-primary me-3"></i>
                  <span>Attend the entrance assessment</span>
                </div>
                <div className="mb-4">
                  <i className="bi bi-4-circle-fill text-primary me-3"></i>
                  <span>Complete the admission process</span>
                </div>
                <Button variant="primary" as={Link} to="/admission" className="mt-3">
                  Learn More About Admission
                </Button>
              </div>
            </Col>
            <Col lg={6} data-aos="fade-left">
              <div className="admission-form p-4">
                <h3 className="mb-4">Start Your Admission Process</h3>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Student's Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="Enter student's name" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Parent's/Guardian's Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Enter parent's/guardian's name" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Class Interested In</Form.Label>
                    <Form.Select 
                      name="classInterested"
                      value={formData.classInterested}
                      onChange={handleChange}
                      required 
                    >
                      <option value="">Select a class</option>
                      <option value="Nursery">Nursery</option>
                      <option value="LKG">LKG</option>
                      <option value="UKG">UKG</option>
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                      <option value="Class 4">Class 4</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter your message" 
                      rows={3}
                    />
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* <!-- Contact Us Section --> */}
      <section className="contact-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8} data-aos="fade-up">
              <h2 className="mb-4">Have Questions?</h2>
              <p className="lead mb-4">
                We're here to help! Get in touch with us for any queries or concerns.
              </p>
              <Button variant="primary" size="lg" as={Link} to="/contact">
                Contact Us
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* <!-- CTA Section --> */}
      <section className="cta-section py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8} data-aos="fade-up">
              <h2 className="mb-4">Ready to Join Our Community?</h2>
              <p className="lead mb-4">
                Take the first step towards a brighter future for your child.
              </p>
              <Button variant="light" size="lg" as={Link} to="/admission">
                Apply Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999
        }}
      >
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
          autohide
          bg={toastVariant}
          className="text-white"
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </div>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </>
  );
};

export default Home;
