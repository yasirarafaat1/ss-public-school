import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Nav, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
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
      const [enquiriesRes, contactsRes, newsletterRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admission').catch(err => {
          console.error('Error fetching enquiries:', err);
          return { data: [] };
        }),
        axios.get('http://localhost:5000/api/contact').catch(err => {
          console.error('Error fetching contacts:', err);
          return { data: [] };
        }),
        axios.get('http://localhost:5000/api/newsletter').catch(err => {
          console.error('Error fetching newsletter subscribers:', err);
          return { data: [] };
        })
      ]);

      console.log('Enquiries:', enquiriesRes.data);
      console.log('Contacts:', contactsRes.data);
      console.log('Newsletter:', newsletterRes.data);

      setEnquiries(enquiriesRes.data || []);
      setContacts(contactsRes.data || []);
      setNewsletterSubscribers(newsletterRes.data || []);
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError("Failed to fetch data. Please check if the backend server is running.");
    }
  };

  const handleDelete = async (type, id) => {
    try {
      let endpoint = '';
      switch (type) {
        case 'enquiry':
          endpoint = 'admission';
          break;
        case 'contact':
          endpoint = 'contact';
          break;
        case 'newsletter':
          endpoint = 'newsletter';
          break;
        default:
          return;
      }

      await axios.delete(`http://localhost:5000/api/${endpoint}/${id}`);
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
    <div className="admin-dashboard pt-5 mt-4">
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Container>
          <span className="navbar-brand">Admin Dashboard</span>
          <div className="d-flex align-items-center">
            <Nav className="me-4">
              <Nav.Link
                className={`text-white ${activeTab === "enquiries" ? "active" : ""}`}
                onClick={() => setActiveTab("enquiries")}
              >
                Admission Enquiries
              </Nav.Link>
              <Nav.Link
                className={`text-white ${activeTab === "contacts" ? "active" : ""}`}
                onClick={() => setActiveTab("contacts")}
              >
                Contact Messages
              </Nav.Link>
              <Nav.Link
                className={`text-white ${activeTab === "newsletter" ? "active" : ""}`}
                onClick={() => setActiveTab("newsletter")}
              >
                Newsletter Subscribers
              </Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Container>
      </nav>

      <Container className="py-5">
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
                        <th>Subject</th>
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
                          <td>{enquiry.subject}</td>
                          <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge bg-${enquiry.status === 'pending' ? 'warning' : 
                              enquiry.status === 'reviewed' ? 'info' : 
                              enquiry.status === 'accepted' ? 'success' : 'danger'}`}>
                              {enquiry.status}
                            </span>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-2">
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
                            <Button variant="outline-primary" size="sm" className="me-2">
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
                            <Button variant="outline-primary" size="sm" className="me-2">
                              Edit
                            </Button>
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