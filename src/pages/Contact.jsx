import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
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
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      setShowToast(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError("Failed to send message. Please try again.");
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
                      >
                        <i className="bi bi-send me-2"></i>
                        Send Message
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

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

      {/* Success Toast */}
      {showToast && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 11 }}
          data-aos="fade-up"
          data-aos-delay="900"
        >
          <div
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header bg-success text-white">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowToast(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">
              Your message has been sent successfully. We will contact you soon.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;