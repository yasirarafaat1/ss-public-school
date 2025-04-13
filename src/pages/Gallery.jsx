import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Gallery = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  const galleryImages = [
    {
      category: "Classrooms",
      images: [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
      ],
    },
    {
      category: "Sports",
      images: [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
      ],
    },
    {
      category: "Events",
      images: [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
      ],
    },
    {
      category: "Infrastructure",
      images: [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww",
      ],
    },
  ];

  return (
    <div className="gallery-page pt-5 mt-5">
      {/* Hero Section */}
      <section 
        // className="hero-section d-flex align-items-center text-white"
        // style={{
        //   backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww')",
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   minHeight: "50vh",
        //   position: "relative"
        // }}
      >
        {/* <div 
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          }}
        ></div> */}
        <Container className="position-relative z-1">
          <Row className="justify-content-center text-center">
            <Col md={8} data-aos="fade-up">
              <h1 className="display-4 fw-bold">Our Gallery</h1>
              <p className="lead">Capturing moments of learning, growth, and achievement</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Gallery Categories */}
      <section className="py-5">
        <Container>
          {galleryImages.map((category, index) => (
            <div key={index} className="mb-5">
              <h2 className="text-center mb-4" data-aos="fade-up">{category.category}</h2>
              <Row className="g-4">
                {category.images.map((image, imgIndex) => (
                  <Col md={4} key={imgIndex} data-aos="fade-up" data-aos-delay={imgIndex * 100}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Img 
                        variant="top" 
                        src={image} 
                        alt={`${category.category} ${imgIndex + 1}`}
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                      <Card.Body className="text-center">
                        <Card.Title>{category.category} {imgIndex + 1}</Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8} data-aos="fade-up">
              <h2 className="mb-4">Want to See More?</h2>
              <p className="lead mb-4">
                Visit our school to experience our vibrant learning environment firsthand.
              </p>
              <Button as={Link} to="/contact" variant="primary" size="lg">
                Schedule a Visit
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Gallery;