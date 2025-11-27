import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseService";
import { useNavigate } from "react-router-dom";
import {
  getContactForms,
  getAdmissionEnquiries,
  getNewsletterSubscriptions,
  adminLogout,
  getStaffMembers,
  getFeeStructure,
  getImportantDates,
  getNotices,
} from "../services/supabaseService";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Alert,
  Spinner,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { FaBars, FaTimes } from "react-icons/fa";
import GalleryManager from "../components/GalleryManager";
import StaffManager from "../components/StaffManager";
import FeeStructureManager from "../components/FeeStructureManager";
import ImportantDatesManager from "../components/ImportantDatesManager";
import NoticesManager from "../components/NoticesManager";
import styles from "../styles/AdminDashboard.module.css";

const AdminDashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [staff, setStaff] = useState([]);
  const [feeStructure, setFeeStructure] = useState([]);
  const [importantDates, setImportantDates] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("gallery");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [
          admissionsList,
          contactsList,
          newslettersList,
          staffList,
          feeData,
          datesData,
          noticesData,
        ] = await Promise.all([
          getAdmissionEnquiries(),
          getContactForms(),
          getNewsletterSubscriptions(),
          getStaffMembers(),
          getFeeStructure(),
          getImportantDates(),
          getNotices(),
        ]);

        setAdmissions(admissionsList);
        setContacts(contactsList);
        setNewsletters(newslettersList);
        setStaff(staffList);
        setFeeStructure(feeData);
        setImportantDates(datesData);
        setNotices(noticesData);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(
          "Failed to load data. Please check your connection or permissions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError("");
      await adminLogout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container-fluid ${styles.dashboardContainer}`}>
      {/* Mobile Toggle Button */}
      <div className={styles.mobileToggle}>
        <Button
          variant="primary"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar-menu"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </Button>
      </div>

      <Row className="flex-nowrap">
        {/* Sidebar Navigation */}
        <Col
          xs={12}
          md={3}
          lg={2}
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
          id="sidebar-menu"
        >
          <div className={styles.sidebarHeader}>
            <h4>Admin Panel</h4>
          </div>

          <Nav
            variant="pills"
            className={`${styles.navPills}`}
            activeKey={activeTab}
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
          >
            <Nav.Item>
              <Nav.Link eventKey="gallery" className="border-0 rounded-0">
                Gallery Management
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="staff" className="border-0 rounded-0">
                Staff Management{" "}
                {/* <span className={styles.navBadge}>{staff.length}</span> */}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fees" className="border-0 rounded-0">
                Fee Structure{" "}
                {/* <span className={styles.navBadge}>{feeStructure.length}</span> */}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="dates" className="border-0 rounded-0">
                Important Dates{" "}
                {/* <span className={styles.navBadge}>{importantDates.length}</span> */}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="notices" className="border-0 rounded-0">
                Notices{" "}
                {/* <span className={styles.navBadge}>{notices.length}</span> */}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="admissions" className="border-0 rounded-0">
                Admission Enquiries{" "}
                {/* <span className={styles.navBadge}>
                  {admissions.length}
                </span> */}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="contacts" className="border-0 rounded-0">
                Contact Forms{" "}
                {/* <span className={styles.navBadge}>{contacts.length}</span> */}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="newsletters" className="border-0 rounded-0">
                Newsletter Subscriptions{" "}
                {/* <span className={styles.navBadge}>{newsletters.length}</span> */}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mt-auto">
              <Nav.Link
                eventKey="logout"
                className="border-0 rounded-0 text-danger"
                onClick={handleLogout}
              >
                Logout
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Main Content Area */}
        <Col xs={12} md={9} lg={10} className={styles.mainContent}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Dashboard</h2>
          </div>

          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}

          {/* Gallery Management */}
          {activeTab === "gallery" && (
            <Card className="mb-4">
              <Card.Body>
                <GalleryManager />
              </Card.Body>
            </Card>
          )}

          {/* Staff Management */}
          {activeTab === "staff" && (
            <Card className="mb-4">
              <Card.Body>
                <StaffManager />
              </Card.Body>
            </Card>
          )}

          {/* Fee Structure Management */}
          {activeTab === "fees" && (
            <Card className="mb-4">
              <Card.Body>
                <FeeStructureManager />
              </Card.Body>
            </Card>
          )}

          {/* Important Dates Management */}
          {activeTab === "dates" && (
            <Card className="mb-4">
              <Card.Body>
                <ImportantDatesManager />
              </Card.Body>
            </Card>
          )}

          {/* Notices Management */}
          {activeTab === "notices" && (
            <Card className="mb-4">
              <Card.Body>
                <NoticesManager />
              </Card.Body>
            </Card>
          )}

          {/* Admission Enquiries Table */}
          {activeTab === "admissions" && (
            <Card className="mb-4">
              <Card.Header as="h5">
                Admission Enquiries ({admissions.length})
              </Card.Header>
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
                          <td>
                            {admission.submitted_at
                              ? new Date(
                                  admission.submitted_at
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                          <td>{admission.student_name}</td>
                          <td>{admission.parent_name}</td>
                          <td>{admission.email}</td>
                          <td>{admission.phone}</td>
                          <td>{admission.class_interested}</td>
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
          )}

          {/* Contact Forms Table */}
          {activeTab === "contacts" && (
            <Card className="mb-4">
              <Card.Header as="h5">
                Contact Forms ({contacts.length})
              </Card.Header>
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
                          <td>
                            {contact.submitted_at
                              ? new Date(contact.submitted_at).toLocaleString()
                              : "N/A"}
                          </td>
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
                  <p>No contact forms found.</p>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Newsletter Subscriptions Table */}
          {activeTab === "newsletters" && (
            <Card className="mb-4">
              <Card.Header as="h5">
                Newsletter Subscriptions ({newsletters.length})
              </Card.Header>
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
                      {newsletters.map((subscription, index) => (
                        <tr key={subscription.id}>
                          <td>{index + 1}</td>
                          <td>
                            {subscription.subscribed_at
                              ? new Date(
                                  subscription.subscribed_at
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                          <td>{subscription.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No newsletter subscriptions found.</p>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
