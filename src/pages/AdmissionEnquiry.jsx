import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios';
import AOS from "aos";
import "aos/dist/aos.css";

const AdmissionEnquiry = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    classInterested: "",
    subject: "",
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
      offset: 100,
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
      const response = await axios.post('http://localhost:5000/api/admission', {
        studentName: formData.studentName,
        parentName: formData.parentName,
        email: formData.email,
        phone: formData.phone,
        classInterested: formData.classInterested,
        subject: formData.subject,
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
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      let errorMessage = "Failed to submit form. Please try again.";
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response.data);
        errorMessage = err.response.data.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        errorMessage = "No response from server. Please check if the backend is running.";
      } else {
        // Something happened in setting up the request that triggered an Error
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
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const admissionSteps = [
    {
      step: "Step 1: Inquiry",
      description:
        "Visit our school or contact us to learn more about our programs and admission requirements.",
      icon: "bi bi-search",
      delay: "100",
    },
    {
      step: "Step 2: Registration",
      description:
        "Complete the registration form and submit required documents for initial screening.",
      icon: "bi bi-pencil-square",
      delay: "200",
    },
    {
      step: "Step 3: Assessment",
      description:
        "Participate in the entrance assessment and interview process.",
      icon: "bi bi-clipboard-check",
      delay: "300",
    },
    {
      step: "Step 4: Admission",
      description:
        "Receive admission confirmation and complete the enrollment process.",
      icon: "bi bi-check-circle",
      delay: "400",
    },
  ];

  return (
    <div className="admission-enquiry-page mt-5">
      {/* Header Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8} data-aos="fade-up" data-aos-delay="100">
              <h1 className="display-4 fw-bold mb-4">Admission Enquiry</h1>
              <p className="lead" data-aos="fade-up" data-aos-delay="200">
                Fill out the form below to start your admission process. Our
                team will get back to you within 24 hours.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Content Section */}
      <section className="py-5">
        <Container>
          <Row>
            {/* Admission Process Steps */}
            <Col md={4} className="mb-4 mb-md-0">
              <Card
                className="border-0 shadow-sm h-100"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">Admission Process</h4>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex flex-column gap-4">
                    {admissionSteps.map((step, index) => (
                      <div
                        key={index}
                        data-aos="fade-up"
                        data-aos-delay={step.delay}
                      >
                        <div className="d-flex align-items-center mb-2">
                          <div
                            className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className={step.icon}></i>
                          </div>
                          <h5 className="mb-0">{step.step}</h5>
                        </div>
                        <p className="ms-4 mb-0">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Enquiry Form */}
            <Col md={8} data-aos="fade-left" data-aos-delay="200">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col md={6} data-aos="fade-up" data-aos-delay="300">
                        <Form.Group controlId="studentName">
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
                      </Col>
                      <Col md={6} data-aos="fade-up" data-aos-delay="400">
                        <Form.Group controlId="parentName">
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
                      </Col>
                      <Col md={6} data-aos="fade-up" data-aos-delay="500">
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
                      <Col md={6} data-aos="fade-up" data-aos-delay="600">
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
                      <Col md={6} data-aos="fade-up" data-aos-delay="700">
                        <Form.Group controlId="classInterested">
                          <Form.Label>Class Interested In</Form.Label>
                          <Form.Select
                            name="classInterested"
                            value={formData.classInterested}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select class</option>
                            <option value="nursery">Nursery</option>
                            <option value="kg">KG</option>
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                            <option value="4">Class 4</option>
                            <option value="5">Class 5</option>
                            <option value="6">Class 6</option>
                            <option value="7">Class 7</option>
                            <option value="8">Class 8</option>
                            <option value="9">Class 9</option>
                            <option value="10">Class 10</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6} data-aos="fade-up" data-aos-delay="800">
                        <Form.Group controlId="subject">
                          <Form.Label>Subject Interested In</Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter subject interested in"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12} data-aos="fade-up" data-aos-delay="900">
                        <Form.Group controlId="message">
                          <Form.Label>Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Enter your message or any specific requirements"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div
                      className="text-center mt-4"
                      data-aos="zoom-in"
                      data-aos-delay="1000"
                    >
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                          </>
                        ) : (
                          "Submit Enquiry"
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

      {isSubmitting && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 2, marginBottom: '80px', marginRight: '20px' }}>
          <div className="d-flex align-items-center bg-light p-2 rounded shadow">
            <div className="spinner-border text-primary me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-primary">
              {isOnline ? "Submitting..." : "Waiting for connection..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionEnquiry;
