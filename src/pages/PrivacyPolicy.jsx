import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="py-5 mt-5">
      <Container>

        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">Privacy Policy</h1>
        </div>

        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-4">Introduction</h2>
                <p>
                  At S.S. Public School, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-4">Information We Collect</h2>
                <h3 className="h5 mb-3">1. Personal Information</h3>
                <p>We may collect the following personal information:</p>
                <ul>
                  <li>Name and contact details (email, phone number)</li>
                  <li>Student information (name, age, class)</li>
                  <li>Parent/Guardian information</li>
                  <li>Address and location data</li>
                  <li>Academic records and performance data</li>
                </ul>

                <h3 className="h5 mb-3 mt-4">2. Non-Personal Information</h3>
                <p>We automatically collect certain non-personal information when you visit our website:</p>
                <ul>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>IP address</li>
                  <li>Pages visited and time spent</li>
                  <li>Referring website</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-4">How We Use Your Information</h2>
                <p>We use the collected information for the following purposes:</p>
                <ul>
                  <li>Processing admission applications and enquiries</li>
                  <li>Communicating with parents and students</li>
                  <li>Providing academic updates and notifications</li>
                  <li>Improving our website and services</li>
                  <li>Ensuring compliance with educational regulations</li>
                  <li>Maintaining school records and documentation</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-4">Data Protection and Security</h2>
                <p>We implement appropriate security measures to protect your personal information:</p>
                <ul>
                  <li>Secure data storage and transmission</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Employee training on data protection</li>
                  <li>Regular backups and disaster recovery plans</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-4">Information Sharing</h2>
                <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
                <ul>
                  <li>Educational authorities and regulatory bodies</li>
                  <li>Service providers who assist in school operations</li>
                  <li>Law enforcement when required by law</li>
                  <li>Other educational institutions for transfer purposes</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-4">Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Request corrections to your data</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of certain communications</li>
                  <li>File a complaint regarding data handling</li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-4">Cookies and Tracking</h2>
                <p>Our website uses cookies to:</p>
                <ul>
                  <li>Improve user experience</li>
                  <li>Analyze website traffic</li>
                  <li>Remember user preferences</li>
                  <li>Provide personalized content</li>
                </ul>
                <p className="mt-3">
                  You can control cookie settings through your browser preferences. However, disabling cookies may affect certain website features.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 mb-4">Children's Privacy</h2>
                <p>
                  We are committed to protecting the privacy of children. Our website and services are designed for use by parents and guardians. We do not knowingly collect personal information from children without parental consent.
                </p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h2 className="h4 mb-4">Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-envelope-fill me-2"></i>
                    <a href="mailto:sspublicschool@gmail.com" className="text-decoration-none">sspublicschool@gmail.com</a>
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-telephone-fill me-2"></i>
                    <a href="tel:+919415808804" className="text-decoration-none">+91 94158 08804</a>
                  </li>
                  <li>
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    Chaunspur road, Yaqutganj, Farrukhabad, Uttar Pradesh - 209749
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyPolicy; 