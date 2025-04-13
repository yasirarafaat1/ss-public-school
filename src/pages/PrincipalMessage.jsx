import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const PrincipalMessage = () => {
  return (
    <div className="py-5 mt-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Breadcrumb */}


            {/* Page Header */}
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-primary">Principal's Message</h1>
              <p className="lead text-muted">Welcome to our school community</p>
            </div>

            {/* Principal's Profile Card */}
            <div className="card shadow-lg mb-5">
              <div className="row g-0">
                <div className="col-md-4">
                  <Image
                    src="https://media.istockphoto.com/id/1300434912/photo/young-business-woman-got-overjoyed-by-good-news-and-started-celebrating-while-working-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=qE_KkcG9arxtuMq1rwNNGpVIUp2fd02nJIs7lkWLZhg="
                    alt="Principal"
                    className="img-fluid rounded-start h-50"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body p-4 p-lg-5">
                    
                    <div className="message-content">
                      <p className="lead mb-4">
                        "Welcome to our school community! It is with great pleasure that I extend my warmest greetings to you."
                      </p>
                      
                      <p className="mb-4">
                        At our institution, we are committed to providing an exceptional educational experience that nurtures 
                        the intellectual, social, and emotional growth of every student. Our dedicated faculty and staff work 
                        tirelessly to create a supportive and challenging environment where students can discover their passions, 
                        develop critical thinking skills, and prepare for success in an ever-changing world.
                      </p>

                      <p className="mb-4">
                        We believe in fostering a culture of respect, integrity, and excellence. Our comprehensive curriculum 
                        and extracurricular programs are designed to help students develop into well-rounded individuals who 
                        are prepared to meet the challenges of the future.
                      </p>

                      <p className="mb-4">
                        As principal, I am proud to lead a team of passionate educators who are committed to providing the 
                        highest quality education. We work closely with parents and the community to ensure that every student 
                        receives the support they need to succeed.
                      </p>

                      <p className="mb-4">
                        I invite you to explore our website and learn more about the outstanding opportunities we offer. 
                        Together, we can help your child achieve their full potential and become responsible global citizens.
                      </p>

                      <p className="mb-0">
                        Warm regards,<br />
                        <strong>Dr. Sarah Johnson</strong><br />
                        Principal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="row g-4">
              <Col md={4}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <i className="fas fa-graduation-cap fa-3x text-primary mb-3"></i>
                    <h5 className="card-title">Academic Excellence</h5>
                    <p className="card-text">Our commitment to providing quality education and fostering academic achievement.</p>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <i className="fas fa-users fa-3x text-primary mb-3"></i>
                    <h5 className="card-title">Community</h5>
                    <p className="card-text">Building strong relationships between students, parents, and staff.</p>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <i className="fas fa-lightbulb fa-3x text-primary mb-3"></i>
                    <h5 className="card-title">Innovation</h5>
                    <p className="card-text">Embracing new teaching methods and technologies to enhance learning.</p>
                  </div>
                </div>
              </Col>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrincipalMessage; 