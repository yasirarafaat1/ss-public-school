import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Toast } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";

const processSteps = [
  {
    step: "Step 1: Inquiry",
    description: "Contact us or visit the school to learn about the admission process.",
    icon: "bi bi-search",
    delay: 100,
  },
  {
    step: "Step 2: Registration",
    description: "Fill out the registration form and submit the required documents.",
    icon: "bi bi-pencil-square",
    delay: 200,
  },
  {
    step: "Step 3: Assessment",
    description: "Participate in the entrance assessment and interview process.",
    icon: "bi bi-clipboard-check",
    delay: 300,
  },
  {
    step: "Step 4: Admission",
    description: "Complete the admission formalities and secure your seat.",
    icon: "bi bi-check-circle",
    delay: 400,
  },
];

const AdmissionEnquiry = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate a successful submission
    setTimeout(() => {
      setToastMessage("Admission enquiry submitted successfully!");
      setToastVariant("success");
      setShowToast(true);

      // Reset form data
      setFormData({
        studentName: "",
        parentName: "",
        email: "",
        phone: "",
        classInterested: "",
        message: "",
      });

      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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

      {/* Process Steps Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">
            Admission Process Steps
          </h2>
          <Row className="g-4">
            {processSteps.map((step, index) => (
              <Col
                md={3}
                key={index}
                data-aos="fade-up"
                data-aos-delay={step.delay}
              >
                <div className="text-center p-4">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className={`${step.icon} display-6`}></i>
                  </div>
                  <h4>{step.step}</h4>
                  <p>{step.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Enquiry Form Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col md={8} className="mx-auto" data-aos="fade-up" data-aos-delay="200">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
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
                      <Col md={6}>
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
                      <Col md={6}>
                        <Form.Group controlId="email">
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
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="phone">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group controlId="classInterested">
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
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group controlId="message">
                          <Form.Label>Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter your message"
                            rows={4}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-center mt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Enquiry"}
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
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        bg={toastVariant}
        className="position-fixed bottom-0 end-0 m-3"
      >
        <Toast.Header>
          <strong className="me-auto">
            {toastVariant === "success" ? "Success" : "Error"}
          </strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default AdmissionEnquiry;