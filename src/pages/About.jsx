import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

const About = () => {
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
            <Col md={6}>
              <Image
                src="https://images.unsplash.com/file-1715651741414-859baba4300dimage?w=416&dpr=2&auto=format&fit=crop&q=60"
                alt="School Image"
                className="img-fluid rounded"
              />
            </Col>
            <Col md={6}>
              <h2>About Our School</h2>
              <p>
                Welcome to our school, where we believe in fostering a nurturing
                environment for students to grow academically, socially, and
                emotionally. Our dedicated staff and state-of-the-art facilities
                ensure that every student receives the best education and
                opportunities to excel.
              </p>
              <p>
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
        <div className="container">
          <div className="row">
            {facility.map((facility, index) => (
              <div className="col-md-4" key={index}>
                <div className="facility text-center">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="img-fluid mb-3"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <h5>{facility.title}</h5>
                  <p>{facility.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
