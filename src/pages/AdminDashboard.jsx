import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Nav, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAdmissionInquiries, getContactSubmissions, deleteAdmissionInquiry, deleteContactSubmission } from "../api/adminService";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("enquiries");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [enquiries, setEnquiries] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [error, setError] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

    // Check authentication
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Verify token (in production, you would verify with your backend)
        const decodedToken = JSON.parse(atob(token));
        const tokenAge = new Date().getTime() - decodedToken.timestamp;
        
        // Token expires after 24 hours
        if (tokenAge > 24 * 60 * 60 * 1000) {
          throw new Error("Session expired");
        }

        setIsAuthenticated(true);
        fetchData();
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchData = async () => {
    try {
      console.log('Fetching data from backend...');
      
      // Use the adminService to fetch data
      const enquiriesData = await getAdmissionInquiries().catch(err => {
        console.error('Error fetching enquiries:', err);
        return [];
      });
      
      const contactsData = await getContactSubmissions().catch(err => {
        console.error('Error fetching contacts:', err);
        return [];
      });

      console.log('Enquiries:', enquiriesData);
      console.log('Contacts:', contactsData);
      
      // Use empty array if data is null or undefined
      setEnquiries(Array.isArray(enquiriesData) ? enquiriesData : []);
      setContacts(Array.isArray(contactsData) ? contactsData : []);
      
      // Newsletter subscribers is not implemented yet, so use empty array
      setNewsletterSubscribers([]);
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError("Failed to fetch data. Please check if the backend server is running.");
    }
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === 'enquiry') {
        await deleteAdmissionInquiry(id);
      } else if (type === 'contact') {
        await deleteContactSubmission(id);
      }
      
      fetchData(); // Refresh data after deletion
    } catch (err) {
      console.error('Error deleting item:', err);
      setError("Failed to delete item. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowDetailsModal(true);
  };

  const handleViewMessage = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Alert variant="danger" className="text-center">
          <h4>Access Denied</h4>
          <p>You are not authorized to view this page.</p>
          <Button variant="primary" onClick={() => navigate("/admin/login")}>
            Go to Login
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="admin-dashboard min-vh-100 pt-4">
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Admin Header */}
      <div className="bg-primary text-white p-4 mb-4">
        <Container className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Admin Dashboard</h2>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Container>
      </div>

      <Container className="py-3">
        {/* Admin navigation tabs */}
        <Nav className="nav-tabs mb-4">
          <Nav.Item>
            <Nav.Link 
              className={activeTab === "enquiries" ? "active" : ""}
              onClick={() => setActiveTab("enquiries")}
            >
              Admission Enquiries
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              className={activeTab === "contacts" ? "active" : ""}
              onClick={() => setActiveTab("contacts")}
            >
              Contact Messages
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              className={activeTab === "newsletter" ? "active" : ""}
              onClick={() => setActiveTab("newsletter")}
            >
              Newsletter Subscribers
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Admission Enquiries Section */}
        {activeTab === "enquiries" && (
          <div data-aos="fade-up">
            <h2 className="mb-4">Admission Enquiries</h2>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Parent Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Class</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map((enquiry) => (
                        <tr key={enquiry._id}>
                          <td>{enquiry._id.substring(0, 6)}</td>
                          <td>{enquiry.studentName}</td>
                          <td>{enquiry.parentName}</td>
                          <td>{enquiry.email}</td>
                          <td>{enquiry.phone}</td>
                          <td>{enquiry.classInterested}</td>
                          <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge bg-${enquiry.status === 'pending' ? 'warning' : 
                              enquiry.status === 'reviewed' ? 'info' : 
                              enquiry.status === 'accepted' ? 'success' : 'danger'}`}>
                              {enquiry.status}
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleViewDetails(enquiry)}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete('enquiry', enquiry._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Enquiry Details Modal */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Enquiry Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEnquiry && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>Student Name</h6>
                    <p>{selectedEnquiry.studentName}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Parent Name</h6>
                    <p>{selectedEnquiry.parentName}</p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>Email</h6>
                    <p>{selectedEnquiry.email}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Phone</h6>
                    <p>{selectedEnquiry.phone}</p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>Class Interested</h6>
                    <p>{selectedEnquiry.classInterested}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Status</h6>
                    <p>
                      <span className={`badge bg-${selectedEnquiry.status === 'pending' ? 'warning' : 
                        selectedEnquiry.status === 'reviewed' ? 'info' : 
                        selectedEnquiry.status === 'accepted' ? 'success' : 'danger'}`}>
                        {selectedEnquiry.status}
                      </span>
                    </p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <h6>Message</h6>
                    <p>{selectedEnquiry.message || 'No message provided'}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h6>Submitted On</h6>
                    <p>{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Contact Messages Section */}
        {activeTab === "contacts" && (
          <div data-aos="fade-up">
            <h2 className="mb-4">Contact Messages</h2>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <tr key={contact._id}>
                          <td>{contact._id.substring(0, 6)}</td>
                          <td>{contact.name}</td>
                          <td>{contact.email}</td>
                          <td>{contact.phone}</td>
                          <td>{contact.subject}</td>
                          <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge bg-${contact.status === 'unread' ? 'warning' : 
                              contact.status === 'read' ? 'info' : 'success'}`}>
                              {contact.status}
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleViewMessage(contact)}
                            >
                              View Message
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete('contact', contact._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Contact Details Modal */}
        <Modal show={showContactModal} onHide={() => setShowContactModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Contact Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedContact && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>Name</h6>
                    <p>{selectedContact.name}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Email</h6>
                    <p>{selectedContact.email}</p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>Phone</h6>
                    <p>{selectedContact.phone}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Subject</h6>
                    <p>{selectedContact.subject}</p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>Status</h6>
                    <p>
                      <span className={`badge bg-${
                        selectedContact.status === 'unread' ? 'warning' : 
                        selectedContact.status === 'read' ? 'info' : 'success'
                      }`}>
                        {selectedContact.status}
                      </span>
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6>Date Received</h6>
                    <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <h6>Message</h6>
                    <div className="p-3 bg-light rounded">
                      <p className="mb-0">{selectedContact.message}</p>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowContactModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Newsletter Subscribers Section */}
        {activeTab === "newsletter" && (
          <div data-aos="fade-up">
            <h2 className="mb-4">Newsletter Subscribers</h2>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Subscription Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletterSubscribers.map((subscriber) => (
                        <tr key={subscriber._id}>
                          <td>{subscriber._id.substring(0, 6)}</td>
                          <td>{subscriber.email}</td>
                          <td>{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge bg-${subscriber.status === "Active" ? "success" : "danger"}`}>
                              {subscriber.status}
                            </span>
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete('newsletter', subscriber._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AdminDashboard; 