import React from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Admission = () => {
  // Admission Process Steps
  const admissionSteps = [
    {
      title: "Step 1: Inquiry",
      description: "Visit the school office or website to collect information about admission procedures and requirements.",
      icon: "bi bi-info-circle"
    },
    {
      title: "Step 2: Registration",
      description: "Fill out the registration form and submit required documents along with the registration fee.",
      icon: "bi bi-pencil-square"
    },
    {
      title: "Step 3: Assessment",
      description: "Student will undergo an assessment test/interview as per the school's admission criteria.",
      icon: "bi bi-clipboard-check"
    },
    {
      title: "Step 4: Admission",
      description: "On successful assessment, complete the admission formalities and pay the required fees.",
      icon: "bi bi-check-circle"
    }
  ];

  // Required Documents
  const requiredDocuments = [
    "Birth Certificate (Original + 2 Photocopies)",
    "Aadhar Card of Student (Original + 2 Photocopies)",
    "Aadhar Card of Parents (Original + 2 Photocopies)",
    "Transfer Certificate (For Class II onwards)",
    "Last Year's Report Card (For Class II onwards)",
    "Passport Size Photographs (4 Nos.)",
    "Address Proof",
    "Caste Certificate (if applicable)"
  ];

  // Fee Structure
  const feeStructure = [
    {
      class: "Nursery to UKG",
      admissionFee: "₹10,000",
      annualFee: "₹5,000",
      monthlyFee: "₹2,500"
    },
    {
      class: "Class I to V",
      admissionFee: "₹12,000",
      annualFee: "₹6,000",
      monthlyFee: "₹3,000"
    },
    {
      class: "Class VI to VIII",
      admissionFee: "₹15,000",
      annualFee: "₹7,000",
      monthlyFee: "₹3,500"
    },
    {
      class: "Class IX to X",
      admissionFee: "₹18,000",
      annualFee: "₹8,000",
      monthlyFee: "₹4,000"
    }
  ];

  return (
    <div className="py-5 mt-5">
      <Container>

        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">Admission Process</h1>
          <p className="lead text-muted">Join our community of learners</p>
        </div>

        {/* Admission Process Steps */}
        <section className="mb-5">
          <h2 className="text-center mb-4">Admission Process</h2>
          <Row className="g-4">
            {admissionSteps.map((step, index) => (
              <Col md={6} lg={3} key={index}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <i className={`${step.icon} display-4 text-primary mb-3`}></i>
                    <h5 className="card-title">{step.title}</h5>
                    <p className="card-text">{step.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Required Documents */}
        <section className="mb-5">
          <Row>
            <Col lg={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-primary text-white">
                  <h3 className="mb-0">Required Documents</h3>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {requiredDocuments.map((doc, index) => (
                      <ListGroup.Item key={index} className="d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        {doc}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-primary text-white">
                  <h3 className="mb-0">Fee Structure</h3>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Class</th>
                          <th>Admission Fee</th>
                          <th>Annual Fee</th>
                          <th>Monthly Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeStructure.map((fee, index) => (
                          <tr key={index}>
                            <td>{fee.class}</td>
                            <td>{fee.admissionFee}</td>
                            <td>{fee.annualFee}</td>
                            <td>{fee.monthlyFee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Additional Information */}
        <section className="mb-5">
          <Row>
            <Col lg={6}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-primary text-white">
                  <h3 className="mb-0">Important Dates</h3>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Registration Start Date</span>
                      <span className="badge bg-primary">1st March</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Last Date for Registration</span>
                      <span className="badge bg-primary">31st March</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Assessment Dates</span>
                      <span className="badge bg-primary">1st - 5th April</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Result Declaration</span>
                      <span className="badge bg-primary">10th April</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h3 className="mb-0">Contact for Admission</h3>
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
                  <Button 
                    variant="primary" 
                    className="mt-3" 
                    as={Link} 
                    to="/admission-enquiry"
                  >
                    Admission Enquiry
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Note */}
        <div className="alert alert-info">
          <i className="bi bi-info-circle-fill me-2"></i>
          <strong>Note:</strong> All fees are subject to revision as per school management's decision. 
          For detailed information, please visit the school office.
        </div>
      </Container>
    </div>
  );
};

export default Admission; 