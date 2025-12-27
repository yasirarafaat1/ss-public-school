import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Toast,
} from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import { submitContactForm } from "../services/supabaseService";

const Contact = () => {
  // const { showSuccess, showError } = useToast();
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

    try {
      await submitContactForm(formData);
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
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setToastMessage("Failed to send message. Please try again.");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                          >
                            <option value="">Select a subject</option>
                            <option value="General Inquiry">
                              General Inquiry
                            </option>
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
                            disabled={isSubmitting}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div
                      className="text-center mt-4"
                      data-aos="zoom-in"
                      data-aos-delay="800"
                    >
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        className="px-5"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
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
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
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
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>

      {/* Contact Information */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} data-aos="fade-up">
              <div className="text-center">
                <h2 className="mb-4">Other Ways to Reach Us</h2>
                <div className="d-flex flex-column flex-md-row justify-content-center gap-4">
                  <div
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="mb-4 mb-md-0"
                  >
                    <i className="bi bi-telephone display-4 text-primary mb-3"></i>
                    <h5>Phone</h5>
                    <p className="mb-0">+91 34343 04234</p>
                  </div>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="mb-4 mb-md-0"
                  >
                    <i className="bi bi-envelope display-4 text-primary mb-3"></i>
                    <h5>Email</h5>
                    <p className="mb-0">demopublicschool@gmail.com</p>
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
