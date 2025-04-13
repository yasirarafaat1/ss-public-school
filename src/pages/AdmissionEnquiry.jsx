import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Toast, ToastContainer } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdmissionEnquiry = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    class: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });

  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setShowToast(true);
    // Reset form
    setFormData({
      studentName: '',
      parentName: '',
      email: '',
      phone: '',
      class: '',
      message: '',
      preferredDate: '',
      preferredTime: ''
    });
  };

  return (
    <div className="py-5 mt-5">
      <Container>


        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">Admission Enquiry</h1>
          <p className="lead text-muted">Fill out the form below to get more information about our admission process</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <ToastContainer position="top-end" className="p-3">
              <Toast 
                show={showToast} 
                onClose={() => setShowToast(false)} 
                delay={3000} 
                autohide
                bg="success"
                className="text-white"
              >
                <Toast.Header closeButton={false}>
                  <strong className="me-auto">Success!</strong>
                </Toast.Header>
                <Toast.Body>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Your enquiry has been submitted successfully. We will contact you shortly.
                </Toast.Body>
              </Toast>
            </ToastContainer>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Enquiry Form</h3>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Student's Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleChange}
                          required
                          placeholder="Enter student's name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Parent's/Guardian's Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleChange}
                          required
                          placeholder="Enter parent's/guardian's name"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter email address"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="Enter phone number"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Class Seeking Admission <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="class"
                          value={formData.class}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Class</option>
                          <option value="Nursery">Nursery</option>
                          <option value="LKG">LKG</option>
                          <option value="UKG">UKG</option>
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
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Preferred Date for Visit</Form.Label>
                        <Form.Control
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Preferred Time for Visit</Form.Label>
                    <Form.Select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                    >
                      <option value="">Select Time</option>
                      <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
                      <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                      <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                      <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Additional Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter any additional information or questions"
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button variant="primary" type="submit" size="lg">
                      <i className="bi bi-send me-2"></i>Submit Enquiry
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Contact Information</h3>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <i className="bi bi-telephone-fill me-2"></i>
                  <a href="tel:+919415808804" className="text-decoration-none">+91 94158 08804</a>
                </div>
                <div className="mb-3">
                  <i className="bi bi-envelope-fill me-2"></i>
                  <a href="mailto:sspublicschool@gmail.com" className="text-decoration-none">sspublicschool@gmail.com</a>
                </div>
                <div className="mb-3">
                  <i className="bi bi-clock-fill me-2"></i>
                  Office Hours: 9:00 AM - 4:00 PM (Monday to Saturday)
                </div>
                <div className="mb-3">
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  Chaunspur road, Yaqutganj, Farrukhabad, Uttar Pradesh - 209749
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Toast Notification */}
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999
          }}
        >
          <Toast 
            onClose={() => setShowToast(false)} 
            show={showToast} 
            delay={3000} 
            autohide
            bg="success"
            className="text-white"
          >
            <Toast.Header>
              <strong className="me-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>
              Your admission enquiry has been submitted successfully. We will contact you shortly.
            </Toast.Body>
          </Toast>
        </div>
      </Container>
    </div>
  );
};

export default AdmissionEnquiry; 