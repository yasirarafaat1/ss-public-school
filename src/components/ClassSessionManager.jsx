import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Tab,
  Table,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSync, FaUser, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import {
  getClasses,
  getSessions,
  getStudentClasses,
  getStudents,
  isSessionInPast,
} from "../services/classStudentService";
import StudentProfile from "./StudentProfile";
import SkeletonLoader from "./SkeletonLoader";

const ClassSessionManager = ({ refreshTimestamp }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("classes");
  const [loading, setLoading] = useState({
    classes: false,
    sessions: false,
    students: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Data states
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [allStudentClasses, setAllStudentClasses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  // Filtered data for current session
  const [currentSessionClasses, setCurrentSessionClasses] = useState([]);
  const [currentSessionClassStudents, setCurrentSessionClassStudents] =
    useState({});

  // Load all data on component mount and when refreshTimestamp changes
  useEffect(() => {
    loadData();
  }, [refreshTimestamp]); // This ensures the data is refreshed when the refresh button is clicked in the admin panel

  // Update current session and filtered data when sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      // Find the current (non-past) session
      const current = sessions.find((session) => !isSessionInPast(session));
      setCurrentSession(current || sessions[0]); // Use first session if no current session
    }
  }, [sessions]);

  useEffect(() => {
    if (currentSession && classes.length > 0 && allStudentClasses.length > 0) {
      // Filter classes for current session
      const currentSessionClassesData = classes.map((cls) => {
        const classAssignments = allStudentClasses.filter(
          (sc) => sc.class_id === cls.id && sc.session_id === currentSession.id
        );
        return {
          ...cls,
          studentCount: classAssignments.length,
          assignments: classAssignments,
        };
      });
      setCurrentSessionClasses(currentSessionClassesData);

      // Get students for each class in current session
      const classStudents = {};
      classes.forEach((cls) => {
        const classAssignments = allStudentClasses.filter(
          (sc) => sc.class_id === cls.id && sc.session_id === currentSession.id
        );
        const studentIds = classAssignments.map((sc) => sc.student_id);
        const classStudentsList = allStudents.filter((student) =>
          studentIds.includes(student.id)
        );
        classStudents[cls.id] = classStudentsList;
      });
      setCurrentSessionClassStudents(classStudents);
    }
  }, [currentSession, classes, allStudentClasses, allStudents]);

  const loadData = async () => {
    try {
      setLoading({ classes: true, sessions: true, students: true });

      const [classesData, sessionsData, studentClassesData, studentsData] =
        await Promise.all([
          getClasses(),
          getSessions(),
          getStudentClasses(),
          getStudents(),
        ]);

      setClasses(classesData);
      setSessions(sessionsData);
      setAllStudentClasses(studentClassesData);
      setAllStudents(studentsData);
      setError("");
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error(err);
    } finally {
      setLoading({ classes: false, sessions: false, students: false });
    }
  };

  const refreshTabData = async (tab) => {
    try {
      switch (tab) {
        case "classes":
          setLoading((prev) => ({ ...prev, classes: true }));
          const [classesData, studentClassesData, studentsData] =
            await Promise.all([
              getClasses(),
              getStudentClasses(),
              getStudents(),
            ]);
          setClasses(classesData);
          setAllStudentClasses(studentClassesData);
          setAllStudents(studentsData);
          break;
        case "sessions":
          setLoading((prev) => ({ ...prev, sessions: true }));
          const sessionsData = await getSessions();
          setSessions(sessionsData);
          break;
        default:
          break;
      }
    } catch (err) {
      setError("Failed to refresh data. Please try again.");
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, [tab]: false }));
    }
  };

  const handleViewClassStudents = (classId) => {
    // Navigate to a new page showing students in this class
    navigate(`/admin/class/${classId}/students`);
  };

  const handleViewStudentProfile = (student) => {
    setSelectedStudent(student);
    setShowStudentProfile(true);
  };

  const handleBackToManager = () => {
    setShowStudentProfile(false);
    setSelectedStudent(null);
  };

  if (showStudentProfile && selectedStudent) {
    return (
      <StudentProfile
        student={selectedStudent}
        onBack={handleBackToManager}
        onUpdate={() => refreshTabData("classes")}
      />
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Classes & Sessions Management</h4>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => refreshTabData(activeTab)}
                  disabled={loading[activeTab]}
                >
                  <FaSync
                    className={`me-2 ${loading[activeTab] ? "fa-spin" : ""}`}
                  />
                  Refresh {activeTab === "classes" ? "Classes" : "Sessions"}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError("")}
                  dismissible
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  variant="success"
                  onClose={() => setSuccess("")}
                  dismissible
                >
                  {success}
                </Alert>
              )}

              <Tabs
                activeKey={activeTab}
                onSelect={(tab) => setActiveTab(tab)}
                className="mb-3"
              >
                {/* Classes Tab */}
                <Tab eventKey="classes" title="Classes">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>
                      Classes in Current Session:{" "}
                      {currentSession ? (
                        <Badge bg="primary">
                          {currentSession.start_month}/
                          {currentSession.start_year} -{" "}
                          {currentSession.end_month}/{currentSession.end_year}
                        </Badge>
                      ) : (
                        "No current session"
                      )}
                    </h5>
                    <Button
                      variant="primary"
                      onClick={() => navigate("/admin/class/add")}
                    >
                      Add Class
                    </Button>
                  </div>

                  {loading.classes ? (
                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Class</th>
                            <th>Class Code</th>
                            <th>Student Count</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <SkeletonLoader type="table-row" count={5} />
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Class</th>
                            <th>Class Code</th>
                            <th>Student Count</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentSessionClasses.length > 0 ? (
                            currentSessionClasses.map((cls) => (
                              <tr key={cls.id}>
                                <td>{cls.class_number}</td>
                                <td>{cls.class_code}</td>
                                <td>
                                  <Badge bg="info">
                                    {cls.studentCount} students
                                  </Badge>
                                </td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() =>
                                      handleViewClassStudents(cls.id)
                                    }
                                    className="me-2"
                                  >
                                    <FaUsers className="me-1" /> View Students
                                  </Button>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() =>
                                      navigate(`/admin/class/${cls.id}/edit`)
                                    }
                                  >
                                    Edit
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="4"
                                className="text-center text-muted"
                              >
                                No classes found for current session
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Tab>

                {/* Sessions Tab */}
                <Tab eventKey="sessions" title="Sessions">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>All Sessions</h5>
                    <Button
                      variant="primary"
                      onClick={() => navigate("/admin/session/add")}
                    >
                      Add Session
                    </Button>
                  </div>

                  {loading.sessions ? (
                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Session</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <SkeletonLoader type="table-row" count={5} />
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Session</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.length > 0 ? (
                            sessions.map((session) => (
                              <tr key={session.id}>
                                <td>
                                  {session.start_year} -{" "}
                                  {session.end_year}
                                </td>
                                <td>
                                  {new Date(
                                    session.start_year,
                                    session.start_month - 1,
                                    1
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  {new Date(
                                    session.end_year,
                                    session.end_month - 1,
                                    1
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  {isSessionInPast(session) ? (
                                    <Badge bg="secondary">Past</Badge>
                                  ) : (
                                    <Badge bg="success">Current</Badge>
                                  )}
                                </td>
                                <td>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() =>
                                      navigate(
                                        `/admin/session/${session.id}/edit`
                                      )
                                    }
                                    className="me-2"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    onClick={() => {
                                      setCurrentSession(session);
                                      setActiveTab("classes");
                                    }}
                                  >
                                    View Classes
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="text-center text-muted"
                              >
                                No sessions found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClassSessionManager;
