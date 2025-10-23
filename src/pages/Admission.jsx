import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Spinner,
  Accordion,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  getPublicFeeStructure,
  getPublicImportantDates,
} from "../services/firebaseService";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  admissionSteps,
  feeStructure as localFeeStructure,
  importantDates as localImportantDates,
} from "../data/data";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaGraduationCap,
  FaQuestionCircle,
  FaEnvelope,
  FaUserGraduate,
  FaClipboardList,
  FaClock,
  FaUserTie,
  FaCheckCircle,
  FaFileSignature,
  FaFileImage,
  FaIdCard,
  FaFileMedicalAlt,
  FaFileContract,
  FaRocket,
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BiSolidBookAlt, BiSolidSchool } from "react-icons/bi";
import { MdOutlineContactSupport } from "react-icons/md";

const Admission = () => {
  const [feeStructure, setFeeStructure] = useState([]);
  const [importantDates, setImportantDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

    const fetchData = async () => {
      try {
        const [feeData, datesData] = await Promise.all([
          getPublicFeeStructure(),
          getPublicImportantDates(),
        ]);

        // Log the data to debug
        console.log("Fee Data from Firebase:", feeData);
        // If feeData is an object with a classes array, use that, otherwise use the data directly
        const feeStructureData =
          feeData.classes || (Array.isArray(feeData) ? feeData : []);
        setFeeStructure(feeStructureData);
        setImportantDates(datesData.dates || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to local data when Firebase read permission denied or fetch fails
        try {
          setFeeStructure(
            Array.isArray(localFeeStructure)
              ? localFeeStructure
              : localFeeStructure.classes || []
          );
          setImportantDates(localImportantDates || []);
        } catch (e) {
          console.error("Failed to set local fallback data:", e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5 py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="admission-page">
      {/* Hero Section */}
      <section className="py-5 bg-primary text-white position-relative overflow-hidden">
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
            zIndex: -1,
          }}
        ></div>
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={10} className="mx-auto text-center">
              <div className="d-inline-block p-3 bg-white bg-opacity-10 rounded-circle mb-4">
                <FaUserGraduate size={48} className="text-white" />
              </div>
              <h1 className="display-4 fw-bold mb-4" data-aos="fade-up">
                Admissions Open <span className="text-warning">2024-25</span>
              </h1>
              <p
                className="lead mb-4 px-lg-5"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Join our legacy of excellence in education. Limited seats
                available for the upcoming academic session.
              </p>
              <div
                className="d-flex flex-wrap justify-content-center gap-3"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <Button
                  as={Link}
                  to="/admission/enquiry"
                  variant="light"
                  size="lg"
                  className="mt-4"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <i className="bi bi-pencil-square me-2"></i>
                  Start Your Admission Enquiry
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Admission Process */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">
            How to Apply
          </h2>
          <Row className="g-4">
            {admissionSteps.map((step, index) => (
              <Col
                md={3}
                data-aos="fade-up"
                data-aos-delay={step.delay}
                key={index}
              >
                <div className="text-center p-4">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className={`${step.icon} display-6`}></i>
                  </div>
                  <h4>{step.step}</h4>
                  <p>{step.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Fee Structure Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">
            Fee Structure
          </h2>
          <Row className="justify-content-center">
            <Col md={10} data-aos="zoom-in">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-primary">
                    <tr>
                      <th>Class</th>
                      <th>Admission Fee</th>
                      <th>Annual Fee</th>
                      <th>Monthly Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(feeStructure) && feeStructure.length > 0 ? (
                      feeStructure.map((fee, index) => {
                        // Log each fee item for debugging
                        console.log(`Fee item ${index}:`, fee);
                        return (
                          <tr key={index}>
                            <td>
                              {fee.className ||
                                fee.class ||
                                `Class ${index + 1}`}
                            </td>
                            <td>
                              {fee.admissionFee || fee.admissionFee === 0
                                ? `₹${fee.admissionFee}`
                                : "N/A"}
                            </td>
                            <td>
                              {fee.annualFee || fee.annualFee === 0
                                ? `₹${fee.annualFee}`
                                : "N/A"}
                            </td>
                            <td>
                              {fee.monthlyFees || fee.monthlyFees === 0
                                ? `₹${fee.monthlyFees}`
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No fee structure available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center" data-aos="fade-up">
                <p className="text-muted">
                  * Fees are subject to change. Additional charges may apply.
                </p>
                <Button variant="primary" as={Link} to="/contact">
                  Contact for Detailed Fee Structure
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Important Dates Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5" data-aos="fade-up">
            Important Dates
          </h2>
          <Row className="g-4">
            {importantDates.length > 0 ? (
              importantDates.map((date, index) => (
                <Col
                  md={4}
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="text-center">
                      <div
                        className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: "60px", height: "60px" }}
                      >
                        <FaCalendarAlt size={24} />
                      </div>
                      <h4 className="h5 mb-3">
                        {date.description || "Important Date"}
                      </h4>

                      <div className="bg-light p-3 rounded">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                          <span className="text-muted">
                            {date.date
                              ? (() => {
                                  const startDate = new Date(date.date);
                                  if (date.endDate) {
                                    const endDate = new Date(date.endDate);
                                    const startMonth = startDate.toLocaleString(
                                      "default",
                                      { month: "long" }
                                    );
                                    const endMonth = endDate.toLocaleString(
                                      "default",
                                      { month: "long" }
                                    );
                                    const startDay = startDate.getDate();
                                    const endDay = endDate.getDate();
                                    const year = endDate.getFullYear();
                                    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
                                  }
                                  return startDate.toLocaleString("default", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  });
                                })()
                              : "N/A"}
                          </span>
                        </div>
                        {date.time && (
                          <div className="d-flex align-items-center justify-content-center">
                            <FaClock className="text-primary me-2" />
                            <span className="text-muted">{date.time}</span>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12} className="text-center">
                <p>
                  No important dates scheduled yet. Please check back later.
                </p>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* Required Documents */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-4" data-aos="fade-up">
              Required Documents
            </h2>
            <p
              className="text-muted mx-auto"
              style={{ maxWidth: "700px" }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Please ensure you have the following documents ready for the
              admission process
            </p>
          </div>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="row g-4">
                {[
                  {
                    icon: <FaFileAlt size={24} className="text-primary m-0" />,
                    title: "Birth Certificate",
                    description:
                      "Original and 2 photocopies (in English or with translation)",
                  },
                  {
                    icon: (
                      <FaClipboardList size={24} className="text-primary m-0" />
                    ),
                    title: "Previous School Records",
                    description:
                      "Report cards and transfer certificate (if applicable)",
                  },
                  {
                    icon: (
                      <FaFileImage size={24} className="text-primary m-0" />
                    ),
                    title: "Passport Photographs",
                    description: "6 recent color passport-size photographs",
                  },
                  {
                    icon: <FaIdCard size={24} className="text-primary m-0" />,
                    title: "Aadhaar Card",
                    description:
                      "Original and 2 photocopies of student and parents' Aadhaar cards",
                  },
                  {
                    icon: (
                      <FaFileMedicalAlt
                        size={24}
                        className="text-primary m-0"
                      />
                    ),
                    title: "Medical Certificate",
                    description:
                      "Medical fitness certificate from a registered practitioner",
                  },
                  {
                    icon: (
                      <FaFileContract size={24} className="text-primary m-0" />
                    ),
                    title: "Address Proof",
                    description:
                      "Any valid address proof (Aadhaar Card/Passport/Electricity Bill)",
                  },
                ].map((doc, index) => (
                  <Col
                    md={6}
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  >
                    <div className="d-flex p-3 bg-white rounded-3 shadow-sm h-100">
                      <div
                        className="bg-primary bg-opacity-10 p-3 rounded-circle me-3"
                        style={{ width: "54px", height: "54px" }}
                      >
                        {doc.icon}
                      </div>
                      <div>
                        <h5 className="mb-1 fw-bold">{doc.title}</h5>
                        <p className="text-muted mb-0 small">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">
              FAQ
            </span>
            <h2 className="fw-bold mb-4" data-aos="fade-up">
              Frequently Asked Questions
            </h2>
            <p
              className="text-muted mx-auto"
              style={{ maxWidth: "700px" }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Find answers to common questions about our admission process
            </p>
          </div>
          <Row className="justify-content-center">
            <Col md={8} data-aos="fade-up">
              <Accordion defaultActiveKey="0" className="shadow-sm">
                {[
                  {
                    question: "What is the age requirement for admission?",
                    answer:
                      "The age requirement varies by grade level. Please contact our admissions office for specific age requirements for the grade you are interested in.",
                  },
                  {
                    question: "Is there an entrance exam?",
                    answer:
                      "Yes, students are required to take an entrance assessment for proper grade placement.",
                  },
                  {
                    question: "What are the school timings?",
                    answer:
                      "Regular school hours are from 8:30 AM to 3:00 PM, Monday through Friday. Early drop-off and after-school programs are available.",
                  },
                  {
                    question: "Do you offer transportation?",
                    answer:
                      "Yes, we provide transportation services covering most areas. Please contact us for specific route information.",
                  },
                  {
                    question: "What is the student-teacher ratio?",
                    answer:
                      "We maintain a low student-teacher ratio to ensure personalized attention, typically around 15:1.",
                  },
                ].map((faq, index) => (
                  <Accordion.Item
                    eventKey={index.toString()}
                    key={index}
                    className="border-0 mb-2 rounded overflow-hidden"
                  >
                    <Accordion.Header className="bg-light">
                      <h5 className="mb-0">{faq.question}</h5>
                    </Accordion.Header>
                    <Accordion.Body className="bg-white">
                      {faq.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Begin Your Journey */}
      {/* Quick Enquiry Section */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} data-aos="fade-up">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-5">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <h3
                        className="mb-3"
                        data-aos="fade-right"
                        data-aos-delay="100"
                      >
                        Ready to Begin Your Journey?
                      </h3>
                      <p
                        className="lead mb-0"
                        data-aos="fade-right"
                        data-aos-delay="200"
                      >
                        Start your admission process today by filling out our
                        quick enquiry form. Our team will get back to you within
                        24 hours.
                      </p>
                    </Col>
                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                      <Button
                        as={Link}
                        to="/admission/enquiry"
                        variant="primary"
                        size="lg"
                        data-aos="zoom-in"
                        data-aos-delay="300"
                      >
                        <i className="bi bi-arrow-right-circle me-2"></i>
                        Enquire Now
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Information */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} data-aos="fade-up">
              <div className="text-center">
                <h2 className="mb-4">Need Help?</h2>
                <p className="lead mb-4">
                  Our admission team is here to assist you with any questions
                  about the admission process.
                </p>
                <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                  <Button variant="primary" size="lg" className="mb-3 mb-md-0">
                    <i className="bi bi-telephone me-2"></i>
                    +91 94158 08804
                  </Button>
                  <Button variant="outline-primary" size="lg">
                    <i className="bi bi-envelope me-2"></i>
                    sspublicschool@gmail.com
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Admission;
