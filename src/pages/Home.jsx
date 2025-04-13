import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const Home = () => {
  return (
    <>
      {/* <!-- Hero Section --> */}
      <section
        className="hero-section d-flex align-items-center text-white mt-5"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1728404059704-d4232080b338?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2Nob29sJTIwc3RhZmZ8ZW58MHx8MHx8fDA%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div className="overlay"></div>
        <Container className="py-10">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h1 className="display-3 fw-bold hero-title animate__animated animate__fadeInDown">
                Welcome to <span className="highlight">Our School</span>
              </h1>
              <p className="lead mt-3 hero-subtitle animate__animated animate__fadeInUp">
                Empowering students with{" "}
                <span className="highlight">knowledge</span>, creativity, and
                values for a brighter future.
              </p>
              <a
                href="/admission"
                className="btn btn-primary btn-lg mt-4 animate__animated animate__zoomIn"
              >
                Enroll Now
              </a>
            </Col>
          </Row>
        </Container>
      </section>

      {/* <!-- Programs Section --> */}
      <section id="programs" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4 animate__animated animate__fadeIn">
            Our Programs
          </h2>
          <div className="row text-center">
            <div className="col-md-4">
              <i className="bi bi-book program-icon animate__animated animate__bounceIn"></i>
              <h3>Academic Excellence</h3>
              <p>Comprehensive curriculum designed to empower every learner.</p>
            </div>
            <div className="col-md-4">
              <i
                className="bi bi-music-note program-icon animate__animated animate__bounceIn"
                data-wow-delay="0.2s"
              ></i>
              <h3>Music & Arts</h3>
              <p>
                Encouraging creativity through various music and art programs.
              </p>
            </div>
            <div className="col-md-4">
              <i
                className="bi bi-dribbble program-icon animate__animated animate__bounceIn"
                data-wow-delay="0.4s"
              ></i>
              <h3>Sports</h3>
              <p>
                Promoting physical health and teamwork through diverse sports
                activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Mission and Vision Section --> */}
      <section id="mission-vision" className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-6 animate__animated animate__fadeInLeft">
              <h2>Our Mission</h2>
              <p>
                To provide a nurturing environment where students can grow
                academically, socially, and emotionally.
              </p>
            </div>
            <div className="col-md-6 animate__animated animate__fadeInRight">
              <h2>Our Vision</h2>
              <p>
                To be a leading institution recognized for excellence in
                education and character development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Services Section --> */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">
            <i className="bi bi-stars me-2"></i>Our Programs
          </h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-book-half display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Academics</h5>
                  <p className="card-text">
                    Offering world-class education across all grades and
                    disciplines.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-person-lines-fill display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Faculty</h5>
                  <p className="card-text">
                    Learn from experienced and passionate educators.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <i className="bi bi-emoji-smile display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Student Life</h5>
                  <p className="card-text">
                    Clubs, sports, and events to enrich every student's
                    experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Call to Action Section --> */}
      <section
        id="cta"
        className="py-5 text-center text-white"
        style={{ backgroundColor: "#007bff" }}
      >
        <div className="container">
          <h2 className="animate__animated animate__fadeIn">
            Join Our Community
          </h2>
          <p className="lead animate__animated animate__fadeIn">
            Enroll now and be a part of our growing family.
          </p>
          <a
            href="/contact"
            className="btn btn-light btn-lg animate__animated animate__zoomIn"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
};

export default Home;
