import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Toast } from "react-bootstrap";
import axios from 'axios';
import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      console.log('Submitting contact form data:', formData);
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      console.log('Contact form submission response:', response.data);
      
      setToastMessage("Message sent successfully! We'll get back to you soon.");
      setToastVariant("success");
      setShowToast(true);
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      let errorMessage = "Failed to send message. Please try again.";
      
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="contact-page mt-5">
      {/* Header Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8} data-aos="fade-up" data-aos-delay="100">
              <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
              <p className="lead" data-aos="fade-up" data-aos-delay="200">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} data-aos="fade-up">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  {error && (
                    <Alert variant="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col md={6} data-aos="fade-up" data-aos-delay="300">
                        <Form.Group controlId="name">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} data-aos="fade-up" data-aos-delay="400">
                        <Form.Group controlId="email">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} data-aos="fade-up" data-aos-delay="500">
                        <Form.Group controlId="phone">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} data-aos="fade-up" data-aos-delay="600">
                        <Form.Group controlId="subject">
                          <Form.Label>Subject</Form.Label>
                          <Form.Select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select a subject</option>
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Feedback">Feedback</option>
                            <option value="Complaint">Complaint</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={12} data-aos="fade-up" data-aos-delay="700">
                        <Form.Group controlId="message">
                          <Form.Label>Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Enter your message"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="text-center mt-4" data-aos="zoom-in" data-aos-delay="800">
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        className="px-5"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Toast Notification */}
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

      {/* Contact Information */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} data-aos="fade-up">
              <div className="text-center">
                <h2 className="mb-4">Other Ways to Reach Us</h2>
                <div className="d-flex justify-content-center gap-4">
                  <div data-aos="fade-up" data-aos-delay="100">
                    <i className="bi bi-telephone display-4 text-primary mb-3"></i>
                    <h5>Phone</h5>
                    <p className="mb-0">+91 94158 08804</p>
                  </div>
                  <div data-aos="fade-up" data-aos-delay="200">
                    <i className="bi bi-envelope display-4 text-primary mb-3"></i>
                    <h5>Email</h5>
                    <p className="mb-0">sspublicschool@gmail.com</p>
                  </div>
                  <div data-aos="fade-up" data-aos-delay="300">
                    <i className="bi bi-geo-alt display-4 text-primary mb-3"></i>
                    <h5>Address</h5>
                    <p className="mb-0">123 School Street, City, State</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;