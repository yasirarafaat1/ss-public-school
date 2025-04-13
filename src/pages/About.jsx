import React, { useEffect } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  // Define an array of sections
  const facility = [
    {
      title: "Our Mission",
      content:
        "We aim to nurture and develop the unique talents of each student, preparing them for a successful future.",
      image:
        "https://images.unsplash.com/flagged/photo-1561476589-e1f20238b297?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNjaG9vbCUyMHN0YWZmfGVufDB8fDB8fHww",
      alt: "Mission Image",
    },
    {
      title: "Our Vision",
      content:
        "To be a leading educational institution recognized for excellence in teaching, learning, and student development.",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=60",
      alt: "Vision Image",
    },
    {
      title: "Our Values",
      content: "Integrity, Respect, Excellence, Innovation, and Collaboration.",
      image:
        "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&auto=format&fit=crop&q=60",
      alt: "Values Image",
    },
  ];

  return (
    <>
      {/* <!-- About School Section --> */}
      <section className="py-5 bg-light mt-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} data-aos="fade-right">
              <Image
                src="https://images.unsplash.com/file-1715651741414-859baba4300dimage?w=416&dpr=2&auto=format&fit=crop&q=60"
                alt="School Image"
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6} data-aos="fade-left">
              <h2 className="display-4 fw-bold mb-4">About Our School</h2>
              <p className="lead mb-4">
                Welcome to our school, where we believe in fostering a nurturing
                environment for students to grow academically, socially, and
                emotionally. Our dedicated staff and state-of-the-art facilities
                ensure that every student receives the best education and
                opportunities to excel.
              </p>
              <p className="lead">
                With a focus on innovation, collaboration, and excellence, we
                aim to prepare our students for a bright and successful future.
                Join us in our journey to inspire and empower the leaders of
                tomorrow.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <div className="row">
            {facility.map((facility, index) => (
              <div className="col-md-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="facility text-center p-4">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="img-fluid mb-4 rounded shadow"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <h4 className="mb-3">{facility.title}</h4>
                  <p className="lead">{facility.content}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h2 className="text-center mb-5 display-5 fw-bold text-primary" data-aos="fade-up">
                Message from the Principal
              </h2>
              <div className="card border-0 shadow-lg overflow-hidden" data-aos="zoom-in">
                <div className="row g-0">
                  <div className="col-md-4 d-flex align-items-center" data-aos="fade-right">
                    <img
                      src="https://media.istockphoto.com/id/1300434912/photo/young-business-woman-got-overjoyed-by-good-news-and-started-celebrating-while-working-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=qE_KkcG9arxtuMq1rwNNGpVIUp2fd02nJIs7lkWLZhg="
                      className="img-fluid rounded-start"
                      alt="Principal [Name]"
                      style={{ objectFit: "cover", height: "100%" }}
                    />
                  </div>
                  <div className="col-md-8" data-aos="fade-left">
                    <div className="card-body p-4 p-lg-5">
                      <div className="d-flex align-items-center mb-4">
                        <div>
                          <h3 className="card-title mb-1">Dr. Jane Smith</h3>
                          <p className="text-muted mb-0">Principal</p>
                        </div>
                      </div>

                      <blockquote className="blockquote mb-4">
                        <p className="lead fst-italic">
                          "At [School Name], we believe in nurturing each
                          student's unique potential through innovative teaching
                          methods and a values-based education system."
                        </p>
                      </blockquote>

                      <div className="card-text">
                        <p className="lead">
                          Detailed message text goes here... Our commitment to
                          academic excellence combined with character development
                          ensures our students become responsible global citizens.
                        </p>

                        <div className="mt-4">
                          <a href="/principal-message" className="btn btn-outline-primary">
                            Read Full Message{" "}
                            <i className="bi bi-arrow-right ms-2"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default About;
