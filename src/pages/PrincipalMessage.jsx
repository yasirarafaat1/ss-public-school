import React, { useEffect } from "react";
import { Container, Row, Col, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const PrincipalMessage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="py-5 mt-5">
      <Container fluid className="px-md-5">
        <Row className="justify-content-center">
          <Col lg={11}>
            {/* Page Header */}
            <div className="text-center mb-5" data-aos="fade-down">
              <h1 className="display-4 fw-bold text-primary">Principal's Message</h1>
              <p className="lead text-muted">Welcome to our school community</p>
            </div>

            {/* Principal's Profile Card */}
            <Card className="shadow-lg mb-5 overflow-hidden" data-aos="fade-up">
              <Row className="g-0">
                <Col md={3} className="d-flex align-items-center justify-content-center p-0">
                  <div className="h-100 w-100">
                    <Image
                      src="https://media.istockphoto.com/id/1300434912/photo/young-business-woman-got-overjoyed-by-good-news-and-started-celebrating-while-working-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=qE_KkcG9arxtuMq1rwNNGpVIUp2fd02nJIs7lkWLZhg="
                      alt="Principal"
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                </Col>
                <Col md={9}>
                  <Card.Body className="p-3 p-lg-4">
                    <div className="message-content">
                      <p className="lead mb-3" data-aos="fade-left" data-aos-delay="100">
                        "Welcome to our school community! I am delighted to greet you."
                      </p>
                      
                      <p className="mb-3" data-aos="fade-left" data-aos-delay="200">
                        We provide exceptional education that nurtures intellectual, social, and emotional growth. 
                        Our dedicated team creates a supportive environment where students discover their talents and 
                        develop critical thinking skills.
                      </p>

                      <p className="mb-3" data-aos="fade-left" data-aos-delay="300">
                        We foster respect, integrity, and excellence. Our programs help students become well-rounded 
                        individuals ready for future challenges.
                      </p>

                      <p className="mb-3" data-aos="fade-left" data-aos-delay="400">
                        As principal, I lead passionate educators committed to quality education. We partner with 
                        parents to ensure every student receives the support they need.
                      </p>

                      <p className="mb-3" data-aos="fade-left" data-aos-delay="500">
                        Explore our website to learn about our opportunities. Together, we'll help your child 
                        reach their potential.
                      </p>

                      <div data-aos="fade-up" data-aos-delay="600">
                        <p className="mb-0">
                          Regards,<br />
                          <strong>Dr. Sarah Johnson</strong><br />
                          Principal
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>

            {/* Additional Information */}
            <Row className="g-4 mb-5">
              <Col md={4} data-aos="fade-up" data-aos-delay="100">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <i className="bi bi-mortarboard-fill text-primary display-4 mb-3"></i>
                    <h5 className="card-title">Academic Excellence</h5>
                    <p className="card-text">Our commitment to providing quality education and fostering academic achievement.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} data-aos="fade-up" data-aos-delay="200">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <i className="bi bi-people-fill text-primary display-4 mb-3"></i>
                    <h5 className="card-title">Community</h5>
                    <p className="card-text">Building strong relationships between students, parents, and staff.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} data-aos="fade-up" data-aos-delay="300">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <i className="bi bi-lightbulb-fill text-primary display-4 mb-3"></i>
                    <h5 className="card-title">Innovation</h5>
                    <p className="card-text">Embracing new teaching methods and technologies to enhance learning.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Back to Home Button */}
            <div className="text-center mt-4" data-aos="zoom-in">
              <Link to="/" className="btn btn-primary">
                <i className="bi bi-arrow-left me-2"></i>Back to Home
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrincipalMessage; 