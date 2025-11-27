import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Accordion,
} from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import { admissionSteps, requiredDocuments } from "../data/data";
import {
  getFeeStructure,
  getImportantDates,
} from "../services/supabaseService";
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
  FaRupeeSign,
} from "react-icons/fa";
import { BiSolidBookAlt, BiSolidSchool } from "react-icons/bi";
import { MdOutlineContactSupport } from "react-icons/md";
import styles from "../styles/Admission.module.css";

const Admission = () => {
  const [loading, setLoading] = useState(true);
  const [feeStructure, setFeeStructure] = useState([]);
  const [importantDates, setImportantDates] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

    // Simulate loading for demo purposes
    const timer = setTimeout(() => {
      fetchFeeStructure();
      fetchImportantDates();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchFeeStructure = async () => {
    try {
      setLoading(true);
      const data = await getFeeStructure();
      setFeeStructure(data);
    } catch (err) {
      console.error("Error fetching fee structure:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchImportantDates = async () => {
    try {
      const data = await getImportantDates();
      setImportantDates(data);
    } catch (err) {
      console.error("Error fetching important dates:", err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate) return "";

    const start = formatDate(startDate);

    if (endDate) {
      const end = formatDate(endDate);
      return `${start} - ${end}`;
    }

    return start;
  };

  // Skeleton loader components
  const SkeletonTextLarge = () => (
    <div className={styles.skeletonTextLarge}></div>
  );

  const SkeletonText = () => <div className={styles.skeletonText}></div>;

  const SkeletonTextSmall = () => (
    <div className={styles.skeletonTextSmall}></div>
  );

  const SkeletonCard = () => <div className={styles.skeletonCard}></div>;

  const SkeletonTable = () => <div className={styles.skeletonTable}></div>;

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
              {loading ? (
                <>
                  <SkeletonTextLarge />
                  <div className="mt-4">
                    <SkeletonText />
                  </div>
                </>
              ) : (
                <>
                  <h1 className="display-4 fw-bold mb-4" data-aos="fade-up">
                    Admissions Open{" "}
                    <span className="text-warning">2024-25</span>
                  </h1>
                  <p
                    className="lead mb-4 px-lg-5"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    Join our legacy of excellence in education. Limited seats
                    available for the upcoming academic session.
                  </p>
                </>
              )}
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
                  disabled={loading}
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
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Col md={3} key={index} data-aos="fade-up">
                    <div className="text-center p-4">
                      <SkeletonCard />
                    </div>
                  </Col>
                ))
              : admissionSteps.map((step, index) => (
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
          {loading ? (
            <Row className="justify-content-center">
              <Col xs={12}>
                <SkeletonTable />
              </Col>
            </Row>
          ) : feeStructure.length > 0 ? (
            <Row className="justify-content-center">
              <Col xs={12}>
                <Card className="shadow-sm">
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table responsive striped bordered hover className="mb-0">
                        <thead>
                          <tr>
                            <th>Class</th>
                            <th>
                              <div className="d-flex align-items-center">
                                <span>Admission Fee</span>
                              </div>
                            </th>
                            <th>
                              <div className="d-flex align-items-center">
                                <span>Monthly Fee</span>
                              </div>
                            </th>
                            <th>
                              <div className="d-flex align-items-center">
                                <span>Annual Fee</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeStructure.map((fee, index) => (
                            <tr key={index}>
                              <td>{fee.class_name}</td>
                              <td>{formatCurrency(fee.admission_fee)}</td>
                              <td>{formatCurrency(fee.monthly_fee)}</td>
                              <td>{formatCurrency(fee.annual_fee)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <Row className="justify-content-center">
              <Col xs={12} md={8}>
                <Card className="text-center p-4 p-md-5">
                  <Card.Body>
                    <div className="d-flex justify-content-center mb-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-4">
                        <FaRupeeSign size={32} className="text-primary" />
                      </div>
                    </div>
                    <h4 className="mb-3">Fee Structure Coming Soon</h4>
                    <p className="text-muted">
                      Please contact our admission office for detailed fee
                      information.
                    </p>
                    <Button variant="primary" as={Link} to="/contact">
                      Contact Us
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Important Dates Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <div className="d-flex justify-content-center mb-3"></div>
            <h2 className="fw-bold">Important Dates</h2>
          </div>

          {loading ? (
            <Row className="justify-content-center g-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Col md={6} lg={4} key={index} data-aos="fade-up">
                  <SkeletonCard />
                </Col>
              ))}
            </Row>
          ) : importantDates.length > 0 ? (
            <Row className="justify-content-center g-4">
              {importantDates.map((date, index) => (
                <Col
                  md={6}
                  lg={4}
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <Card className="h-100 border-0 shadow-sm hover-effect">
                    <Card.Body className="text-center p-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                        <FaCalendarAlt className="text-primary" size={24} />
                      </div>
                      <h5 className="mb-3">{date.event_name}</h5>
                      <div className="d-flex justify-content-center">
                        <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                          {formatDateRange(date.start_date, date.end_date)}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Row className="justify-content-center">
              <Col xs={12} md={8}>
                <Card className="text-center p-4 p-md-5">
                  <Card.Body>
                    <div className="d-flex justify-content-center mb-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-4">
                        <FaCalendarAlt size={32} className="text-primary" />
                      </div>
                    </div>
                    <h4 className="mb-3">Important Dates Coming Soon</h4>
                    <p className="text-muted">
                      Please check back later for important admission dates.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Required Documents */}
      <section className="py-5 bg-light">
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
                {loading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <Col md={6} key={index} data-aos="fade-up">
                        <SkeletonCard />
                      </Col>
                    ))
                  : [
                      {
                        icon: (
                          <FaFileAlt size={24} className="text-primary m-0" />
                        ),
                        title: "Birth Certificate",
                        description:
                          "Original and 2 photocopies (in English or with translation)",
                      },
                      {
                        icon: (
                          <FaClipboardList
                            size={24}
                            className="text-primary m-0"
                          />
                        ),
                        title: "Previous School Records",
                        description:
                          "Report cards and transfer certificate (if applicable)",
                      },
                      {
                        icon: (
                          <FaIdCard size={24} className="text-primary m-0" />
                        ),
                        title: "Identity Documents",
                        description:
                          "Aadhar cards of student and parents (original + photocopies)",
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
                          "Health certificate from a registered medical practitioner",
                      },
                      {
                        icon: (
                          <FaFileContract
                            size={24}
                            className="text-primary m-0"
                          />
                        ),
                        title: "Address Proof",
                        description:
                          "Electricity bill, ration card or any government document",
                      },
                      {
                        icon: (
                          <FaFileImage size={24} className="text-primary m-0" />
                        ),
                        title: "Photographs",
                        description:
                          "Passport size photographs (4 copies) and stamp size (2 copies)",
                      },
                    ].map((doc, index) => (
                      <Col
                        md={6}
                        key={index}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <Card className="h-100 border-0 shadow-sm">
                          <Card.Body className="d-flex align-items-start gap-3">
                            <div className="mt-1">{doc.icon}</div>
                            <div>
                              <h5 className="mb-2">{doc.title}</h5>
                              <p className="text-muted mb-0">
                                {doc.description}
                              </p>
                            </div>
                          </Card.Body>
                        </Card>
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
              {loading ? (
                <div className="p-4">
                  <SkeletonCard />
                </div>
              ) : (
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
              )}
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
                      {loading ? (
                        <>
                          <SkeletonTextSmall />
                          <div className="mt-3">
                            <SkeletonText />
                          </div>
                        </>
                      ) : (
                        <>
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
                            Start your admission process today by filling out
                            our quick enquiry form. Our team will get back to
                            you within 24 hours.
                          </p>
                        </>
                      )}
                    </Col>
                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                      <Button
                        as={Link}
                        to="/admission/enquiry"
                        variant="primary"
                        size="lg"
                        data-aos="zoom-in"
                        data-aos-delay="300"
                        disabled={loading}
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
                {loading ? (
                  <>
                    <SkeletonTextSmall />
                    <div className="my-4">
                      <SkeletonText />
                    </div>
                    <div className="d-flex justify-content-center">
                      <SkeletonCard />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mb-4">Need Help?</h2>
                    <p className="lead mb-4">
                      Our admission team is here to assist you with any
                      questions about the admission process.
                    </p>
                    <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                      <Button
                        variant="primary"
                        size="lg"
                        className="mb-3 mb-md-0"
                      >
                        <i className="bi bi-telephone me-2"></i>
                        +91 94158 08804
                      </Button>
                      <Button variant="outline-primary" size="lg">
                        <i className="bi bi-envelope me-2"></i>
                        sspublicschool@gmail.com
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Admission;
