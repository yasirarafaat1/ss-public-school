import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaPhone,
  FaEnvelope,
  FaSearch,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getStaffMembers } from "../services/adminService";
import AOS from "aos";
import "aos/dist/aos.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ErrorBoundary from "../components/ErrorBoundary";

gsap.registerPlugin(ScrollTrigger);

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const staffRef = useRef(null);

  // Fetch staff data from Firebase
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError("");
        const staffData = await getStaffMembers();
        setStaff(staffData);

        // Initialize AOS after data is loaded
        AOS.init({
          duration: 800,
          once: true,
        });

        // Animate staff cards with GSAP after a small delay to ensure DOM is updated
        setTimeout(() => {
          if (staffRef.current) {
            gsap.fromTo(
              staffRef.current.querySelectorAll(".staff-card"),
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.1,
                scrollTrigger: {
                  trigger: staffRef.current,
                  start: "top 80%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
        }, 100);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setError("Failed to load staff members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Filter staff based on search term and role
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.qualification?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" ||
      (member.role && member.role.toLowerCase().includes(filterRole));
    return matchesSearch && matchesRole;
  });

  // Get unique roles for filter
  const roles = [
    ...new Set(staff.map((member) => member.role).filter(Boolean)),
  ];

  const handleImageError = (e) => {
    e.target.src = "/logo.png"; // Fallback to your local logo
  };

  // Get role icon
  const getRoleIcon = (role) => {
    if (!role) return <FaUserGraduate className="me-2" />;
    if (role.toLowerCase().includes("principal"))
      return <FaUserTie className="me-2" />;
    if (
      role.toLowerCase().includes("teacher") ||
      role.toLowerCase().includes("head")
    )
      return <FaChalkboardTeacher className="me-2" />;
    return <FaUserGraduate className="me-2" />;
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading staff information...</p>
      </div>
    );
  }

  // Show error message if there's an error
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
    <div className="staff-page">
      {/* Hero Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center py-5">
            <h1 className="display-5 fw-bold mb-3" data-aos="fade-up">
              Our Dedicated Faculty
            </h1>
            <p
              className="lead text-muted mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Meet our team of experienced and passionate educators
            </p>
          </div>
        </Container>
      </section>

      {/* Search and Filter */}
      <section className="py-4 bg-white">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="mb-3">
              <div className="position-relative">
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                  <FaSearch className="text-muted" />
                </div>
                <Form.Control
                  type="search"
                  placeholder="Search by name, role, or qualification..."
                  className="ps-5 py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Select
                className="form-select py-3"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                {roles.map((role, index) => (
                  <option key={index} value={role.toLowerCase()}>
                    {role}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Staff Grid */}
      <section className="py-5">
        <Container>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-5">
              <FaUserTie className="display-4 text-muted mb-3" />
              <h4>No staff members found</h4>
              <p className="text-muted">
                {searchTerm || filterRole !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Please check back later for updates"}
              </p>
              {(searchTerm || filterRole !== "all") && (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterRole("all");
                  }}
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <Row className="g-4" ref={staffRef}>
              {filteredStaff.map((staff, index) => (
                <Col
                  key={index}
                  lg={6}
                  xl={4}
                  data-aos="fade-up"
                  data-aos-delay={(index % 3) * 100}
                >
                  <Card className="h-100 border-0 shadow-sm staff-card">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0 me-4">
                          <ErrorBoundary fallback={<img src="/logo.png" alt="Fallback" />}>
                          <img
                            src={staff.image || "/logo.png"}
                            alt={staff.name}
                            className="rounded-circle"
                            onError={handleImageError}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                          </ErrorBoundary>
                        </div>
                        <div>
                          <h5 className="mb-1">{staff.name}</h5>
                          <p className="text-muted mb-2 d-flex align-items-center">
                            {getRoleIcon(staff.role)}
                            {staff.role}
                          </p>
                          <p className="small text-muted mb-2">
                            <i className="bi bi-mortarboard me-2"></i>
                            {staff.qualification}
                          </p>
                          <div className="d-flex gap-2">
                            {staff.contact && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="d-flex align-items-center"
                                href={`tel:${staff.contact}`}
                              >
                                <FaPhone className="me-1" />
                                <span>Call</span>
                              </Button>
                            )}
                            {staff.email && (
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                className="d-flex align-items-center"
                                href={`mailto:${staff.email}`}
                              >
                                <FaEnvelope className="me-1" />
                                <span>Email</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Quick Contact Banner */}
      <section className="py-4 bg-primary text-white">
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center py-3">
            <div className="mb-3 mb-md-0">
              <h5 className="mb-1">Need to speak with our administration?</h5>
              <p className="mb-0 small">
                Our office is here to help with any questions
              </p>
            </div>
            <Button variant="light" size="lg" className="px-4">
              <FaPhone className="me-2" /> Contact Office
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Staff;
