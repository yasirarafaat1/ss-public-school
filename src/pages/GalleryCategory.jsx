import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getGalleryImages } from "../services/supabaseService";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import styles from "../styles/Gallery.module.css";

const GalleryCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imagesPerPage = 10;

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    const fetchCategoryImages = async () => {
      try {
        setLoading(true);
        const galleryData = await getGalleryImages();

        // Find the specific category
        const categoryData = galleryData.find(
          (cat) => cat.category.toLowerCase() === category.toLowerCase()
        );

        if (categoryData && categoryData.images) {
          setImages(categoryData.images);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error("Error fetching category images:", err);
        setError("Failed to load gallery images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryImages();
  }, [category]);

  // Calculate pagination
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Lightbox functions
  const openLightbox = (index) => {
    setCurrentImageIndex(indexOfFirstImage + index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when lightbox is open
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  const goToPrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      // Wrap to last image
      setCurrentImageIndex(images.length - 1);
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      // Wrap to first image
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
  }, [lightboxOpen, currentImageIndex, images]);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="mb-4">
      <div className={styles.skeletonLoader}></div>
    </div>
  );

  // Get current image for lightbox
  const getCurrentImage = () => {
    if (images.length === 0 || currentImageIndex >= images.length) return null;
    return images[currentImageIndex];
  };

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
            <Row className="g-4">
              {[...Array(10)].map((_, index) => (
                <Col key={index} sm={6} md={4} lg={3}>
                  <SkeletonLoader />
                </Col>
              ))}
            </Row>
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

  return (
    <div className={styles.galleryPage}>
      {/* Hero Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center py-5">
            <h1 className="display-5 fw-bold mb-3" data-aos="fade-up">
              {category.charAt(0).toUpperCase() + category.slice(1)} Gallery
            </h1>
            <p
              className="lead text-muted mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Browse through our {category} moments and memories
            </p>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/gallery")}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <FaChevronLeft className="me-2" />
              Back to All Galleries
            </Button>
          </div>
        </Container>
      </section>

      {/* Gallery Content */}
      <section className="py-5">
        <Container>
          {images.length === 0 ? (
            <div className="text-center py-5">
              <FaExclamationTriangle className="display-4 text-muted mb-3" />
              <h4>No images found in this category</h4>
              <p className="text-muted">Please check back later for updates</p>
              <Button
                variant="primary"
                onClick={() => navigate("/gallery")}
                className="mt-3"
              >
                <FaChevronLeft className="me-2" />
                Back to All Galleries
              </Button>
            </div>
          ) : (
            <>
              <Row className="g-4">
                {currentImages.map((image, index) => (
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
                      onClick={() => openLightbox(index)}
                    >
                      <div style={{ height: "200px", overflow: "hidden" }}>
                        <Card.Img
                          variant="top"
                          src={image.url}
                          alt={`Gallery image ${index + 1}`}
                          style={{ height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "/assets/placeholder.png";
                          }}
                        />
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <nav>
                    <ul className="pagination">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <FaChevronLeft />
                        </button>
                      </li>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNumber) => (
                          <li
                            key={pageNumber}
                            className={`page-item ${
                              currentPage === pageNumber ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        )
                      )}

                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <FaChevronRight />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
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
                  {getCurrentImage().name ||
                    `Image ${currentImageIndex + 1} of ${images.length}`}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryCategory;
