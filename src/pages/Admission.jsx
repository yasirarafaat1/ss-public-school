import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  admissionSteps,
  requiredDocuments,
  feeStructure,
  importantDates,
} from "../data/data"; // Import all arrays
import AOS from "aos";
import "aos/dist/aos.css";

const Admission = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="admission-page mt-5">

      {/* Header Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8} data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-4">Admission Process</h1>
              <p className="lead">
                Join our community of learners and discover a world of
                opportunities
              </p>
              <Button
                as={Link}
                to="/admission-enquiry"
                variant="light"
                size="lg"
                className="mt-4"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <i className="bi bi-pencil-square me-2"></i>
                Start Your Admission Enquiry
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Admission Process Steps */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">
            How to Apply
          </h2>
          <Row className="g-4">
            {admissionSteps.map((step, index) => (
              <Col
                md={3}
                data-aos="fade-up"
                data-aos-delay={step.delay}
                key={index}
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

      {/* Required Documents */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">
            Required Documents
          </h2>
          <Row className="g-4">
            <Col md={6} data-aos="fade-right">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h4 className="mb-4">Original Documents</h4>
                  <ul className="list-unstyled">
                    {requiredDocuments.original.map((doc, index) => (
                      <li className="mb-3" key={index}>
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} data-aos="fade-left">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <h4 className="mb-4">Photocopies Required</h4>
                  <ul className="list-unstyled">
                    {requiredDocuments.photocopies.map((doc, index) => (
                      <li className="mb-3" key={index}>
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        {doc}
                      </li>
                    ))}
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
          <h2 className="text-center mb-5" data-aos="fade-up">
            Fee Structure
          </h2>
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
            </Col>
          </Row>
        </Container>
      </section>

      {/* Important Dates */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">
            Important Dates
          </h2>
          <Row className="g-4">
            {importantDates.map((date, index) => (
              <Col
                md={4}
                data-aos="fade-up"
                data-aos-delay={date.delay}
                key={index}
              >
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <i className={`${date.icon}`}></i>
                    </div>
                    <h4>{date.title}</h4>
                    <p className="mb-0">{date.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Quick Enquiry Section */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} data-aos="fade-up">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-5">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <h3 className="mb-3" data-aos="fade-right" data-aos-delay="100">
                        Ready to Begin Your Journey?
                      </h3>
                      <p className="lead mb-0" data-aos="fade-right" data-aos-delay="200">
                        Start your admission process today by filling out our
                        quick enquiry form. Our team will get back to you within
                        24 hours.
                      </p>
                    </Col>
                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                      <Button
                        as={Link}
                        to="/admission-enquiry"
                        variant="primary"
                        size="lg"
                        data-aos="zoom-in"
                        data-aos-delay="300"
                      >
                        <i className="bi bi-arrow-right-circle me-2"></i>
                        Enquire Now
                      </Button>
                    </Col>
                  </Row>
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
                  Our admission team is here to assist you with any questions
                  about the admission process.
                </p>
                <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                  <Button variant="primary" size="lg" className="mb-3 mb-md-0">
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
