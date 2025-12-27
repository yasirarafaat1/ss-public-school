import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";
import { getResultByRollNoAndClassCode } from "../services/resultService";
import AOS from "aos";
import "aos/dist/aos.css";
import SkeletonLoader from "../components/SkeletonLoader";

const Result = () => {
  const [rollNo, setRollNo] = useState("");
  const [classCode, setClassCode] = useState("");
  const [result, setResult] = useState(null); // This will now hold an array of results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false); // Changed from resultsLoaded to showResults

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Function to calculate overall metrics
  const calculateOverallMetrics = (results) => {
    if (!Array.isArray(results) || results.length === 0) return null;

    let totalMarks = 0;
    let totalMaxMarks = 0;
    let totalSubjects = 0;
    let passCount = 0;
    const grades = [];
    const statuses = [];

    results.forEach((examResult) => {
      if (examResult.subjects && Array.isArray(examResult.subjects)) {
        examResult.subjects.forEach((subject) => {
          totalMarks += subject.marks || subject.obtained_marks || 0;
          totalMaxMarks += subject.max_marks || 100;
          totalSubjects++;
        });
      }

      if (examResult.grade) {
        grades.push(examResult.grade);
      }

      if (examResult.result_status) {
        statuses.push(examResult.result_status);
      }

      if (examResult.result_status === "Pass") {
        passCount++;
      }
    });

    const overallPercentage =
      totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

    // Determine overall status based on number of passed exams
    const overallStatus = passCount === results.length ? "Pass" : "Fail";

    // For overall grade, we can use a simple average or take the most common grade
    let overallGrade = "N/A";
    if (grades.length > 0) {
      // Simple approach: take the first grade or calculate average if grades are numeric
      overallGrade = grades[0]; // You can implement more complex logic as needed
    }

    return {
      overallPercentage: overallPercentage.toFixed(2),
      overallGrade,
      overallStatus,
      totalExams: results.length,
      passedExams: passCount,
      failedExams: results.length - passCount,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setShowResults(false); // Reset show results state

    try {
      // Validate inputs
      if (!rollNo || !classCode) {
        throw new Error("Please enter both Roll Number and Class Code");
      }

      if (rollNo.length !== 6 || isNaN(rollNo)) {
        throw new Error("Roll Number must be exactly 6 digits");
      }

      const data = await getResultByRollNoAndClassCode(rollNo, classCode);
      if (!data) {
        throw new Error(
          "No result found for the provided Roll Number and Class Code"
        );
      }

      // Set the array of results
      setResult(data);
      setShowResults(true); // Set show results to true after data is fetched
    } catch (err) {
      setError(err.message || "Failed to fetch result. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall metrics
  const overallMetrics =
    result && Array.isArray(result) ? calculateOverallMetrics(result) : null;

  return (
    <Container className="py-5 mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center mb-5" data-aos="fade-down">
            <h1 className="display-4 fw-bold text-primary mb-3">
              Student Result
            </h1>
            <p className="lead text-muted">
              Enter your details to view your academic results
            </p>
            <hr className="my-4" />
          </div>

          <Card className="mb-4 shadow" data-aos="fade-up">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Roll Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter 6-digit roll number"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        maxLength={6}
                        className="form-control-lg"
                        disabled={loading} // Disable input during loading
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Class Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter class code"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        className="form-control-lg"
                        disabled={loading} // Disable input during loading
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-grid mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="btn-lg"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Searching...
                      </>
                    ) : (
                      "View Result"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {error && (
            <Alert
              variant="danger"
              onClose={() => setError("")}
              dismissible
              data-aos="fade-down"
            >
              {error}
            </Alert>
          )}

          {loading && !showResults && (
            <div className="text-center py-5" data-aos="fade-up">
              <Spinner animation="border" role="status" className="mb-3">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Fetching your results...</p>
            </div>
          )}

          {showResults && result && !loading && (
            <Card className="shadow" data-aos="fade-up">
              <Card.Header
                as="h4"
                className="text-center bg-primary text-white py-3"
              >
                Result Details
              </Card.Header>
              <Card.Body>
                {/* Display student information from the first result */}
                {Array.isArray(result) && result.length > 0 && (
                  <Row className="mb-4 g-4">
                    <Col md={6} data-aos="fade-right">
                      <div className="p-3 bg-light rounded">
                        <h5 className="text-primary mb-3">
                          Student Information
                        </h5>
                        <p className="mb-2">
                          <strong>Student Name:</strong>{" "}
                          {result[0].student_name}
                        </p>
                        <p className="mb-2">
                          <strong>Father's Name:</strong>{" "}
                          {result[0].father_name}
                        </p>
                        <p className="mb-2">
                          <strong>Roll Number:</strong> {result[0].roll_no}
                        </p>
                      </div>
                    </Col>
                    <Col md={6} data-aos="fade-left">
                      <div className="p-3 bg-light rounded">
                        <h5 className="text-primary mb-3">Academic Details</h5>
                        <p className="mb-2">
                          <strong>Class:</strong> {result[0].class}
                        </p>
                        <p className="mb-2">
                          <strong>Class Code:</strong> {result[0].class_code}
                        </p>
                      </div>
                    </Col>
                  </Row>
                )}

                {/* Display overall metrics */}
                {overallMetrics && (
                  <Row className="mb-4 g-4">
                    <Col md={12}>
                      <div className="p-3 bg-success text-white rounded">
                        <h5 className="text-white mb-3">
                          Overall Performance Summary
                        </h5>
                        <Row>
                          <Col md={3}>
                            <p className="mb-1">
                              <strong>Overall Grade:</strong>
                            </p>
                            <p className="fw-bold fs-5">
                              {overallMetrics.overallGrade}
                            </p>
                          </Col>
                          <Col md={3}>
                            <p className="mb-1">
                              <strong>Overall Percentage:</strong>
                            </p>
                            <p className="fw-bold fs-5">
                              {overallMetrics.overallPercentage}%
                            </p>
                          </Col>
                          <Col md={3}>
                            <p className="mb-1">
                              <strong>Status:</strong>
                            </p>
                            <p className="fw-bold fs-5">
                              <span
                                className={`badge ${
                                  overallMetrics.overallStatus === "Pass"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {overallMetrics.overallStatus}
                              </span>
                            </p>
                          </Col>
                          <Col md={3}>
                            <p className="mb-1">
                              <strong>Exams:</strong>
                            </p>
                            <p className="fw-bold fs-5">
                              {overallMetrics.passedExams}/
                              {overallMetrics.totalExams} Passed
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                )}

                <div className="mt-4" data-aos="fade-up">
                  <h5 className="text-center mb-4 pb-2 border-bottom">
                    Exam Results
                  </h5>

                  {/* Display all exam results */}
                  {Array.isArray(result) &&
                    result.map((examResult, index) => (
                      <div key={index} className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom bg-light py-2">
                          <h5>
                            {examResult.exam_type || "Result"} Details -{" "}
                            {examResult.exam_date
                              ? new Date(
                                  examResult.exam_date
                                ).toLocaleDateString()
                              : "N/A"}
                          </h5>
                        </div>

                        <Row className="mb-3">
                          <Col md={6}>
                            <p className="mb-1">
                              <strong>Exam Type:</strong>{" "}
                              {examResult.exam_type || "N/A"}
                            </p>
                            <p className="mb-1">
                              <strong>Exam Date:</strong>{" "}
                              {examResult.exam_date
                                ? new Date(
                                    examResult.exam_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                            <p className="mb-0">
                              <strong>Status:</strong>
                              <span
                                className={`badge ms-2 ${
                                  examResult.result_status === "Pass"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {examResult.result_status}
                              </span>
                            </p>
                          </Col>
                          <Col md={6}>
                            <p className="mb-0 text-end">
                              <strong>Grade:</strong>
                              <span className="fw-bold text-primary ms-2">
                                {examResult.grade}
                              </span>
                            </p>
                          </Col>
                        </Row>

                        <Table
                          striped
                          bordered
                          hover
                          responsive
                          className="text-center"
                        >
                          <thead className="table-primary">
                            <tr>
                              <th>Subject</th>
                              <th>Marks</th>
                              <th>Max Marks</th>
                              <th>Percentage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {examResult.subjects &&
                            Array.isArray(examResult.subjects) &&
                            examResult.subjects.length > 0 ? (
                              examResult.subjects.map((subject, subIndex) => (
                                <tr key={subIndex}>
                                  <td className="fw-medium">
                                    {subject.name || subject.subject}
                                  </td>
                                  <td>
                                    <span className="">
                                      {subject.marks ||
                                        subject.obtained_marks ||
                                        0}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="">
                                      {subject.max_marks || 100}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="">
                                      {(
                                        ((subject.marks ||
                                          subject.obtained_marks ||
                                          0) /
                                          (subject.max_marks || 100)) *
                                        100
                                      ).toFixed(1)}
                                      %
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4">No subjects found</td>
                              </tr>
                            )}
                            <tr className="table-active fw-bold">
                              <td>Total</td>
                              <td>
                                {examResult.subjects &&
                                Array.isArray(examResult.subjects)
                                  ? examResult.subjects.reduce(
                                      (sum, subject) =>
                                        sum +
                                        (subject.marks ||
                                          subject.obtained_marks ||
                                          0),
                                      0
                                    )
                                  : 0}
                              </td>
                              <td>
                                {examResult.subjects &&
                                Array.isArray(examResult.subjects)
                                  ? examResult.subjects.reduce(
                                      (sum, subject) =>
                                        sum + (subject.max_marks || 100),
                                      0
                                    )
                                  : examResult.subjects &&
                                    Array.isArray(examResult.subjects)
                                  ? examResult.subjects.length * 100
                                  : 0}
                              </td>
                              <td>
                                {examResult.subjects &&
                                Array.isArray(examResult.subjects) &&
                                examResult.subjects.length > 0
                                  ? (
                                      (examResult.subjects.reduce(
                                        (sum, subject) =>
                                          sum +
                                          (subject.marks ||
                                            subject.obtained_marks ||
                                            0),
                                        0
                                      ) /
                                        examResult.subjects.reduce(
                                          (sum, subject) =>
                                            sum + (subject.max_marks || 100),
                                          0
                                        )) *
                                      100
                                    ).toFixed(1)
                                  : "0.0%"}
                                %
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Loading skeleton for results when they are being loaded */}
          {loading && showResults && (
            <Card className="shadow" data-aos="fade-up">
              <Card.Header
                as="h4"
                className="text-center bg-primary text-white py-3"
              >
                Result Details
              </Card.Header>
              <Card.Body>
                {/* Loading skeleton for student information */}
                <Row className="mb-4 g-4">
                  <Col md={6} data-aos="fade-right">
                    <div className="p-3 bg-light rounded">
                      <h5 className="text-primary mb-3">Student Information</h5>
                      <SkeletonLoader type="list-item" count={3} />
                    </div>
                  </Col>
                  <Col md={6} data-aos="fade-left">
                    <div className="p-3 bg-light rounded">
                      <h5 className="text-primary mb-3">Academic Details</h5>
                      <SkeletonLoader type="list-item" count={2} />
                    </div>
                  </Col>
                </Row>

                {/* Loading skeleton for overall metrics */}
                <Row className="mb-4 g-4">
                  <Col md={12}>
                    <div className="p-3 bg-success text-white rounded">
                      <h5 className="text-white mb-3">
                        Overall Performance Summary
                      </h5>
                      <SkeletonLoader type="list-item" count={4} />
                    </div>
                  </Col>
                </Row>

                <div className="mt-4" data-aos="fade-up">
                  <h5 className="text-center mb-4 pb-2 border-bottom">
                    Exam Results
                  </h5>

                  {/* Loading skeleton for exam results */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom bg-light py-2">
                      <h5>Exam Details</h5>
                    </div>
                    <SkeletonLoader type="card" count={1} />
                    <div className="table-responsive">
                      <Table
                        striped
                        bordered
                        hover
                        responsive
                        className="text-center"
                      >
                        <thead className="table-primary">
                          <tr>
                            <th>Subject</th>
                            <th>Marks</th>
                            <th>Max Marks</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          <SkeletonLoader type="table-row" count={5} />
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Result;
