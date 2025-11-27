import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getGalleryImages } from "../services/supabaseService";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaExclamationTriangle,
  FaChevronRight,
  FaChevronLeft,
  FaChevronRight as FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import styles from "../styles/Gallery.module.css";

const Gallery = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    const fetchGallery = async () => {
      try {
        setLoading(true);
        const galleryData = await getGalleryImages();
        setCategories(galleryData);
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError("Failed to load gallery images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="mb-4">
      <div className={styles.skeletonLoader}></div>
    </div>
  );

  // Lightbox functions
  const openLightbox = (categoryIndex, imageIndex) => {
    setCurrentCategoryIndex(categoryIndex);
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when lightbox is open
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  const goToPrevImage = () => {
    const currentCategory = categories[currentCategoryIndex];
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentCategoryIndex > 0) {
      // Move to last image of previous category
      const prevCategoryIndex = currentCategoryIndex - 1;
      const prevCategory = categories[prevCategoryIndex];
      setCurrentCategoryIndex(prevCategoryIndex);
      setCurrentImageIndex(prevCategory.images.length - 1);
    }
  };

  const goToNextImage = () => {
    const currentCategory = categories[currentCategoryIndex];
    if (currentImageIndex < currentCategory.images.slice(0, 4).length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      // Move to first image of next category
      const nextCategoryIndex = currentCategoryIndex + 1;
      setCurrentCategoryIndex(nextCategoryIndex);
      setCurrentImageIndex(0);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        goToPrevImage();
      } else if (e.key === "ArrowRight") {
        goToNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, currentImageIndex, currentCategoryIndex, categories]);

  if (loading) {
    return (
      <div className={styles.galleryPage}>
        {/* Hero Section */}
        <section className="py-5 bg-light">
          <Container>
            <div className="text-center py-5">
              <div className={styles.skeletonTextLarge}></div>
              <div className={`${styles.skeletonText} mt-3`}></div>
            </div>
          </Container>
        </section>

        {/* Gallery Content */}
        <section className="py-5">
          <Container>
            <div className="d-flex flex-column align-items-start">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-100 mb-4">
                  <div className={`${styles.skeletonTextSmall} mb-3`}></div>
                  <Row className="g-4">
                    {[...Array(4)].map((_, imgIndex) => (
                      <Col key={imgIndex} sm={6} md={4} lg={3}>
                        <SkeletonLoader />
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      </Container>
    );
  }

  // Get current image for lightbox
  const getCurrentImage = () => {
    if (categories.length === 0 || currentCategoryIndex >= categories.length)
      return null;
    const category = categories[currentCategoryIndex];
    if (
      !category.images ||
      currentImageIndex >= category.images.slice(0, 4).length
    )
      return null;
    return category.images.slice(0, 4)[currentImageIndex];
  };

  return (
    <div className={styles.galleryPage}>
      {/* Hero Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center py-5">
            <h1 className="display-5 fw-bold mb-3" data-aos="fade-up">
              Our School Gallery
            </h1>
            <p
              className="lead text-muted mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Explore our school's moments and memories through our gallery
            </p>
          </div>
        </Container>
      </section>

      {/* Gallery Content */}
      <section className="py-5">
        <Container>
          {categories.length === 0 ? (
            <div className="text-center py-5">
              <FaExclamationTriangle className="display-4 text-muted mb-3" />
              <h4>No gallery images found</h4>
              <p className="text-muted">Please check back later for updates</p>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-start">
              {categories.map((category, categoryIndex) => (
                <div key={category.category} className="w-100 mb-5">
                  {/* Category Header with Arrow */}
                  <div
                    className="d-flex justify-content-between align-items-center mb-4"
                    data-aos="fade-up"
                  >
                    <h2 className={`mb-0 ${styles.categoryTitleLeft}`}>
                      {category.category}
                    </h2>
                    <Button
                      variant="outline-primary"
                      onClick={() =>
                        navigate(`/gallery/${category.category.toLowerCase()}`)
                      }
                    >
                      View All <FaChevronRight className="ms-2" />
                    </Button>
                  </div>

                  {/* Category Images (max 4) */}
                  {category.images && category.images.length > 0 ? (
                    <Row className="g-4">
                      {category.images.slice(0, 4).map((image, index) => (
                        <Col
                          key={image.id || index}
                          sm={6}
                          md={4}
                          lg={3}
                          data-aos="fade-up"
                          data-aos-delay={index * 50}
                        >
                          <Card
                            className={`${styles.imageCard} h-100 border-0 shadow-sm`}
                            onClick={() => openLightbox(categoryIndex, index)}
                          >
                            <div
                              style={{ height: "200px", overflow: "hidden" }}
                            >
                              <Card.Img
                                variant="top"
                                src={image.url}
                                alt={image.name || `Gallery image ${index + 1}`}
                                style={{ height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.src = "/assets/placeholder.png";
                                }}
                              />
                            </div>
                            {/* Hide image name as per user preference */}
                            {/* <Card.Body className="p-3">
                              <Card.Text className="text-muted small mb-0">
                                {image.name}
                              </Card.Text>
                            </Card.Body> */}
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p className="text-center text-muted">
                      No images in this category
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`${styles.lightboxClose}`}
              onClick={closeLightbox}
            >
              <FaTimes />
            </button>

            {getCurrentImage() && (
              <>
                <img
                  src={getCurrentImage().url}
                  alt={getCurrentImage().name || "Gallery image"}
                  className={styles.lightboxImage}
                  onError={(e) => {
                    e.target.src = "/assets/placeholder.png";
                  }}
                />

                <button
                  className={`${styles.lightboxControls} ${styles.lightboxPrev}`}
                  onClick={goToPrevImage}
                >
                  <FaChevronLeft />
                </button>

                <button
                  className={`${styles.lightboxControls} ${styles.lightboxNext}`}
                  onClick={goToNextImage}
                >
                  <FaChevronRight />
                </button>

                <div className={styles.lightboxCaption}>
                  {getCurrentImage().name || `Image ${currentImageIndex + 1}`}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
