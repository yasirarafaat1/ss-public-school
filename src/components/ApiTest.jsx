import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { testApiConnection, diagnose405Error } from '../api/testConnection';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [directTestResult, setDirectTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [fullApiUrl, setFullApiUrl] = useState('');

  useEffect(() => {
    // Get current API URL from environment variables
    const configuredApiUrl = import.meta.env.VITE_API_URL || '/api';
    setApiUrl(configuredApiUrl);
    
    // Calculate full URL if it's relative
    if (!configuredApiUrl.startsWith('http')) {
      setFullApiUrl(`${window.location.origin}${configuredApiUrl}`);
    } else {
      setFullApiUrl(configuredApiUrl);
    }
  }, []);

  const runConnectionTest = async () => {
    setLoading(true);
    try {
      const result = await testApiConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error running connection test',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const runDiagnosis = async () => {
    setLoading(true);
    try {
      // Test both endpoints
      const contactDiagnosis = await diagnose405Error('/contact');
      const admissionDiagnosis = await diagnose405Error('/admission/test');
      const debugDiagnosis = await diagnose405Error('/debug');
      
      setDiagnosisResult({
        contact: contactDiagnosis,
        admission: admissionDiagnosis,
        debug: debugDiagnosis
      });
    } catch (error) {
      setDiagnosisResult({
        error: error.message,
        message: 'Failed to run diagnosis'
      });
    } finally {
      setLoading(false);
    }
  };

  const runDirectTest = async () => {
    setLoading(true);
    try {
      // Test the CORS endpoint directly with fetch
      const url = fullApiUrl + '/cors';
      console.log('Testing direct connection to:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      setDirectTestResult({
        success: true,
        status: response.status,
        statusText: response.statusText,
        data: data
      });
    } catch (error) {
      console.error('Direct test error:', error);
      setDirectTestResult({
        success: false,
        message: 'Direct fetch failed',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">API Connectivity Test</h4>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-column gap-3">
            <div>
              <p>
                API configuration: <strong>{apiUrl}</strong><br/>
                Full API URL: <strong>{fullApiUrl}</strong>
                {apiUrl === 'Not configured' && 
                  <Alert variant="warning" className="mt-2">
                    API URL is not configured. Check your .env.production file.
                  </Alert>
                }
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <Button 
                  onClick={runConnectionTest} 
                  disabled={loading}
                  variant="primary"
                >
                  {loading ? 'Testing...' : 'Test Connection (axios)'}
                </Button>
                <Button 
                  onClick={runDirectTest}
                  disabled={loading}
                  variant="info"
                >
                  {loading ? 'Testing...' : 'Direct Test (fetch)'}
                </Button>
                <Button 
                  onClick={runDiagnosis}
                  disabled={loading}
                  variant="secondary"
                >
                  {loading ? 'Diagnosing...' : 'Diagnose Endpoints'}
                </Button>
              </div>
            </div>

            <Row className="mt-4">
              {testResult && (
                <Col md={12}>
                  <Alert variant={testResult.success ? 'success' : 'danger'}>
                    <h5>Axios Test Result: {testResult.message}</h5>
                    <pre className="mt-2" style={{ maxHeight: '200px', overflow: 'auto' }}>
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </Alert>
                </Col>
              )}

              {directTestResult && (
                <Col md={12}>
                  <Alert variant={directTestResult.success ? 'success' : 'danger'}>
                    <h5>Direct Fetch Test Result</h5>
                    <pre className="mt-2" style={{ maxHeight: '200px', overflow: 'auto' }}>
                      {JSON.stringify(directTestResult, null, 2)}
                    </pre>
                  </Alert>
                </Col>
              )}

              {diagnosisResult && (
                <Col md={12}>
                  <Alert variant="info">
                    <h5>API Endpoint Diagnosis</h5>
                    <pre className="mt-2" style={{ maxHeight: '300px', overflow: 'auto' }}>
                      {JSON.stringify(diagnosisResult, null, 2)}
                    </pre>
                  </Alert>
                </Col>
              )}
            </Row>

            <div className="mt-3">
              <h5>Troubleshooting Tips</h5>
              <ul>
                <li><strong>Failed to fetch</strong>: This usually means a network error, CORS issue, or the API endpoint doesn't exist</li>
                <li><strong>405 Method Not Allowed</strong>: The API endpoint exists but doesn't support the HTTP method you're using</li>
                <li><strong>CORS error</strong>: Your API needs to add proper CORS headers to allow requests from your frontend</li>
              </ul>
            </div>
            
            <Alert variant="info" className="mt-3">
              <h5>Important Note About Vercel Deployment</h5>
              <p>
                Your API is now configured to use <strong>relative URLs</strong> which will:
              </p>
              <ul>
                <li>Work correctly with your Vercel serverless functions</li>
                <li>Use the same domain as your frontend application</li>
                <li>Avoid CORS issues since everything is on the same domain</li>
              </ul>
              <p>
                You must deploy the API serverless functions to Vercel for this to work. After deployment,
                visit <code>/api-test</code> on your deployed site to verify the API is working.
              </p>
            </Alert>
          </div>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">
            API endpoints in the <code>/api</code> directory will be deployed as serverless functions by Vercel automatically.
          </small>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ApiTest; 