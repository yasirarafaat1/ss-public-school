import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Infrastructure = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  return (
    <div className="infrastructure-page mt-5">

      {/* Classrooms Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Modern Classrooms</h2>
          <Row className="g-4">
            <Col md={6} data-aos="fade-right">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww" 
                alt="Classrooms" 
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6} data-aos="fade-left">
              <div className="p-4">
                <h3 className="mb-4">Smart Learning Environment</h3>
                <p className="lead mb-4">
                  Our classrooms are equipped with modern technology and comfortable furniture to create an optimal learning environment.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Interactive smart boards
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Comfortable seating arrangements
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Proper ventilation and lighting
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Digital learning resources
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Library Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Library</h2>
          <Row className="g-4">
            <Col md={6} data-aos="fade-right">
              <div className="p-4">
                <h3 className="mb-4">Knowledge Hub</h3>
                <p className="lead mb-4">
                  Our well-stocked library provides students with access to a wide range of books and digital resources.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Extensive collection of books
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Digital reading resources
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Quiet study areas
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Research facilities
                  </li>
                </ul>
              </div>
            </Col>
            <Col md={6} data-aos="fade-left">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww" 
                alt="Library" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sports Facilities Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Sports Facilities</h2>
          <Row className="g-4">
            <Col md={6} data-aos="fade-right">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww" 
                alt="Sports Facilities" 
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6} data-aos="fade-left">
              <div className="p-4">
                <h3 className="mb-4">Sports Complex</h3>
                <p className="lead mb-4">
                  Our sports facilities encourage physical fitness and team spirit among students.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Indoor sports arena
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Outdoor playgrounds
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Swimming pool
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Sports equipment
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Labs Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Science Labs</h2>
          <Row className="g-4">
            <Col md={6} data-aos="fade-right">
              <div className="p-4">
                <h3 className="mb-4">Modern Laboratories</h3>
                <p className="lead mb-4">
                  Well-equipped laboratories for hands-on learning and scientific exploration.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Physics lab
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Chemistry lab
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Biology lab
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    Computer lab
                  </li>
                </ul>
              </div>
            </Col>
            <Col md={6} data-aos="fade-left">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww" 
                alt="Science Labs" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Additional Facilities Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">Additional Facilities</h2>
          <Row className="g-4">
            <Col md={4} data-aos="zoom-in" data-aos-delay="100">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <i className="bi bi-cup-hot text-primary display-4 mb-3"></i>
                  <Card.Title>Cafeteria</Card.Title>
                  <Card.Text>
                    Hygienic and nutritious food options for students and staff.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} data-aos="zoom-in" data-aos-delay="200">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <i className="bi bi-shield-check text-primary display-4 mb-3"></i>
                  <Card.Title>Security</Card.Title>
                  <Card.Text>
                    24/7 security surveillance and controlled access.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} data-aos="zoom-in" data-aos-delay="300">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <i className="bi bi-heart-pulse text-primary display-4 mb-3"></i>
                  <Card.Title>Medical Room</Card.Title>
                  <Card.Text>
                    Well-equipped medical room with trained staff.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Infrastructure;