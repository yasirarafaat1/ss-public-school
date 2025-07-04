import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseService";
import { useNavigate } from 'react-router-dom';
import { 
  getContactForms, 
  getAdmissionEnquiries, 
  getNewsletterSubscriptions,
  adminLogout // Import the logout function
} from "../services/firebaseService"; // Adjust path as needed
import { Container, Row, Col, Card, Table, Button, Alert, Spinner } from 'react-bootstrap';
import SettingsManager from '../components/SettingsManager';
import styles from "../styles/AdminDashboard.module.css"; // Add the missing CSS module import

const AdminDashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Fetching data...');
        const [admissionsList, contactsList, newslettersList] = await Promise.all([
          getAdmissionEnquiries(),
          getContactForms(),
          getNewsletterSubscriptions()
        ]);
        
        console.log('Fetched data:', { admissionsList, contactsList, newslettersList });
        
        setAdmissions(admissionsList);
        setContacts(contactsList);
        setNewsletters(newslettersList);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load data. Please check your connection or permissions.");
        // Potentially handle specific errors, e.g., redirect if not authenticated
        // although ideally, routing should protect this page.
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleLogout = async () => {
    try {
        await adminLogout();
        navigate('/admin/login'); // Redirect to login page after logout
    } catch (err) {
        console.error("Logout failed:", err);
        setError("Logout failed. Please try again."); // Show error on dashboard
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, fetch the data
        try {
          setLoading(true);
          setError('');
          const [admissionsList, contactsList, newslettersList] = await Promise.all([
            getAdmissionEnquiries(),
            getContactForms(),
            getNewsletterSubscriptions()
          ]);
          setAdmissions(admissionsList);
          setContacts(contactsList);
          setNewsletters(newslettersList);
        } catch (err) {
          console.error("Error fetching admin data:", err);
          setError("Failed to load data. Please check your connection or permissions.");
        } finally {
          setLoading(false);
        }
      } else {
        // No user is signed in, redirect to login
        navigate('/admin/login');
      }
    });
  
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  return (
    <Container fluid className={`mt-4 ${styles.dashboardContainer || ''}`}>
      <Row className="mb-3">
        <Col>
          <h1>Admin Dashboard</h1>
        </Col>
        <Col className="text-end">
            <Button variant="danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Logout
            </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading data...</p>
        </div>
      ) : (
        <Row>
          {/* Settings Management */}
          <Col md={12} className="mb-4">
            <SettingsManager />
          </Col>
          {/* Admission Enquiries Table */}
          <Col md={12} className="mb-4">
            <Card>
              <Card.Header as="h5">Admission Enquiries ({admissions.length})</Card.Header>
              <Card.Body>
                {admissions.length > 0 ? (
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Submitted</th>
                        <th>Student Name</th>
                        <th>Parent Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Class Interested</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admissions.map((admission, index) => (
                        <tr key={admission.id}>
                          <td>{index + 1}</td>
                          <td>{admission.submittedAt ? new Date(admission.submittedAt).toLocaleString() : 'N/A'}</td>
                          <td>{admission.studentName}</td>
                          <td>{admission.parentName}</td>
                          <td>{admission.email}</td>
                          <td>{admission.phone}</td>
                          <td>{admission.classInterested}</td>
                          <td>{admission.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No admission enquiries found.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Form Submissions Table */}
          <Col md={12} className="mb-4">
            <Card>
              <Card.Header as="h5">Contact Form Submissions ({contacts.length})</Card.Header>
              <Card.Body>
                 {contacts.length > 0 ? (
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Submitted</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Subject</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, index) => (
                        <tr key={contact.id}>
                          <td>{index + 1}</td>
                          <td>{contact.submittedAt ? new Date(contact.submittedAt).toLocaleString() : 'N/A'}</td>
                          <td>{contact.name}</td>
                          <td>{contact.email}</td>
                          <td>{contact.phone}</td>
                          <td>{contact.subject}</td>
                          <td>{contact.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                 ) : (
                    <p>No contact form submissions found.</p>
                 )}
              </Card.Body>
            </Card>
          </Col>

          {/* Newsletter Subscriptions Table */}
          <Col md={12}>
            <Card>
              <Card.Header as="h5">Newsletter Subscriptions ({newsletters.length})</Card.Header>
              <Card.Body>
                 {newsletters.length > 0 ? (
                  <Table striped bordered hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Subscribed At</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletters.map((newsletter, index) => (
                        <tr key={newsletter.id}>
                          <td>{index + 1}</td>
                          <td>{newsletter.subscribedAt ? new Date(newsletter.subscribedAt).toLocaleString() : 'N/A'}</td>
                          <td>{newsletter.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                 ) : (
                    <p>No newsletter subscriptions found.</p>
                 )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AdminDashboard; 