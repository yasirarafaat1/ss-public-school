import React, { useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Admission = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

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
    <div className="admission-page mt-5">

      {/* Header Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8} data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-4">Admission Process</h1>
              <p className="lead">
                Join our community of learners and discover a world of opportunities
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Admission Process Steps */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">How to Apply</h2>
          <Row className="g-4">
            <Col md={3} data-aos="fade-up" data-aos-delay="100">
              <div className="text-center p-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-search display-6"></i>
                </div>
                <h4>Step 1: Inquiry</h4>
                <p>Visit our school or contact us to learn more about our programs and admission requirements.</p>
              </div>
            </Col>
            <Col md={3} data-aos="fade-up" data-aos-delay="200">
              <div className="text-center p-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-pencil-square display-6"></i>
                </div>
                <h4>Step 2: Registration</h4>
                <p>Complete the registration form and submit required documents for initial screening.</p>
              </div>
            </Col>
            <Col md={3} data-aos="fade-up" data-aos-delay="300">
              <div className="text-center p-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-clipboard-check display-6"></i>
                </div>
                <h4>Step 3: Assessment</h4>
                <p>Participate in the entrance assessment and interview process.</p>
              </div>
            </Col>
            <Col md={3} data-aos="fade-up" data-aos-delay="400">
              <div className="text-center p-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-check-circle display-6"></i>
                </div>
                <h4>Step 4: Admission</h4>
                <p>Receive admission confirmation and complete the enrollment process.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Required Documents */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Required Documents</h2>
          <Row className="g-4">
            <Col md={6} data-aos="fade-right">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h4 className="mb-4">Original Documents</h4>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Birth Certificate
                    </li>
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Aadhar Cards (Student & Parents)
                    </li>
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Transfer Certificate (if applicable)
                    </li>
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Previous Year's Report Card
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} data-aos="fade-left">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h4 className="mb-4">Photocopies Required</h4>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      All original documents (2 sets)
                    </li>
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Passport size photographs (4 copies)
                    </li>
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Address proof
                    </li>
                    <li className="mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Medical certificate
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Fee Structure */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Fee Structure</h2>
          <Row className="justify-content-center">
            <Col md={10} data-aos="zoom-in">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-primary">
                    <tr>
                      <th>Class</th>
                      <th>Admission Fee</th>
                      <th>Annual Fee</th>
                      <th>Monthly Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Nursery - KG</td>
                      <td>₹5,000</td>
                      <td>₹10,000</td>
                      <td>₹2,500</td>
                    </tr>
                    <tr>
                      <td>Class I - V</td>
                      <td>₹7,000</td>
                      <td>₹12,000</td>
                      <td>₹3,000</td>
                    </tr>
                    <tr>
                      <td>Class VI - VIII</td>
                      <td>₹8,000</td>
                      <td>₹15,000</td>
                      <td>₹3,500</td>
                    </tr>
                    <tr>
                      <td>Class IX - X</td>
                      <td>₹10,000</td>
                      <td>₹18,000</td>
                      <td>₹4,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Important Dates */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Important Dates</h2>
          <Row className="g-4">
            <Col md={4} data-aos="fade-up" data-aos-delay="100">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <h4>Registration Period</h4>
                  <p className="mb-0">January 1 - March 31, 2024</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} data-aos="fade-up" data-aos-delay="200">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-pencil-square"></i>
                  </div>
                  <h4>Assessment Dates</h4>
                  <p className="mb-0">April 15 - 30, 2024</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} data-aos="fade-up" data-aos-delay="300">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <h4>Result Declaration</h4>
                  <p className="mb-0">May 15, 2024</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Information */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} data-aos="fade-up">
              <div className="text-center">
                <h2 className="mb-4">Need Help?</h2>
                <p className="lead mb-4">
                  Our admission team is here to assist you with any questions about the admission process.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="primary" size="lg">
                    <i className="bi bi-telephone me-2"></i>
                    +91 94158 08804
                  </Button>
                  <Button variant="outline-primary" size="lg">
                    <i className="bi bi-envelope me-2"></i>
                    sspublicschool@gmail.com
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Admission; 