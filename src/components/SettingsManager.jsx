import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Tab, Tabs, Alert } from 'react-bootstrap';
import { updateFeeStructure, getFeeStructure, updateImportantDates, getImportantDates } from '../services/adminService';
import StaffManager from './StaffManager';

const SettingsManager = () => {
  const [activeTab, setActiveTab] = useState('feeStructure');
  const [feeStructure, setFeeStructure] = useState({
    classes: [],
    lastUpdated: new Date().toISOString()
  });
  const [importantDates, setImportantDates] = useState({
    dates: [],
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [feeData, datesData] = await Promise.all([
          getFeeStructure(),
          getImportantDates()
        ]);
        setFeeStructure({
          classes: feeData.classes || [],
          lastUpdated: feeData.lastUpdated || new Date().toISOString()
        });
        setImportantDates({
          dates: datesData.dates || [],
          lastUpdated: datesData.lastUpdated || new Date().toISOString()
        });
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFeeStructureChange = (e) => {
    const { name, value } = e.target;
    setFeeStructure(prev => ({
      ...prev,
      classes: prev.classes.map((cls, index) => 
        index === Number(name.split('-')[1]) ? { ...cls, [name.split('-')[0]]: value } : cls
      )
    }));
  };

  const handleAddFeeClass = () => {
    setFeeStructure(prev => ({
      ...prev,
      classes: [...prev.classes, { className: '', admissionFee: '', annualFee: '', monthlyFee: '' }]
    }));
  };

  const handleRemoveFeeClass = (index) => {
    setFeeStructure(prev => ({
      ...prev,
      classes: prev.classes.filter((_, i) => i !== index)
    }));
  };

  const handleImportantDatesChange = (e) => {
    const { name, value } = e.target;
    const [field, index] = name.split('-');
    
    setImportantDates(prev => ({
      ...prev,
      dates: prev.dates.map((date, i) => 
        i === Number(index) ? { 
          ...date, 
          [field]: value,
          // Ensure endDate is not before date
          ...(field === 'date' && date.endDate && new Date(value) > new Date(date.endDate) 
            ? { endDate: value } 
            : {})
        } : date
      )
    }));
  };

  const handleAddImportantDate = () => {
    setImportantDates(prev => ({
      ...prev,
      dates: [...prev.dates, { 
        date: '', 
        endDate: '',
        time: '',
        description: '' 
      }]
    }));
  };

  const handleRemoveImportantDate = (index) => {
    setImportantDates(prev => ({
      ...prev,
      dates: prev.dates.filter((_, i) => i !== index)
    }));
  };

  const handleSaveFeeStructure = async () => {
    try {
      setLoading(true);
      setError('');
      const dataToSave = {
        classes: feeStructure.classes || [],
        lastUpdated: new Date().toISOString()
      };
      await updateFeeStructure(dataToSave);
      setFeeStructure(dataToSave);
      setSuccess('Fee structure updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating fee structure:', err);
      setError('Failed to update fee structure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImportantDates = async () => {
    try {
      setLoading(true);
      setError('');
      const dataToSave = {
        dates: importantDates.dates || [],
        lastUpdated: new Date().toISOString()
      };
      await updateImportantDates(dataToSave);
      setImportantDates(dataToSave);
      setSuccess('Important dates updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating important dates:', err);
      setError('Failed to update important dates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
        fill
      >
        <Tab eventKey="staff" title="Staff Management">
          <div className="mt-4">
            <StaffManager />
          </div>
        </Tab>
        <Tab eventKey="feeStructure" title="Fee Structure">
          <Card>
            <Card.Body>
              <Form>
                {feeStructure.classes.map((cls, index) => (
                  <Row key={index} className="mb-3">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Class Name</Form.Label>
                        <Form.Control
                          type="text"
                          name={`className-${index}`}
                          value={cls.className || ''}
                          onChange={handleFeeStructureChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>admission Fee</Form.Label>
                        <Form.Control
                          type="number"
                          name={`admissionFee-${index}`}
                          value={cls.admissionFee || ''}
                          onChange={handleFeeStructureChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Annual Fee</Form.Label>
                        <Form.Control
                          type="number"
                          name={`annualFee-${index}`}
                          value={cls.annualFee || ''}
                          onChange={handleFeeStructureChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Monthly Fee</Form.Label>
                        <Form.Control
                          type="number"
                          name={`monthlyFees-${index}`}
                          value={cls.monthlyFees || ''}
                          onChange={handleFeeStructureChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={1} className="align-self-center">
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveFeeClass(index)}
                        disabled={feeStructure.classes.length === 1}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button
                  variant="primary"
                  onClick={handleAddFeeClass}
                  className="mb-3"
                >
                  Add Class
                </Button>
                <Button
                  variant="success"
                  onClick={handleSaveFeeStructure}
                  disabled={loading}
                >
                  Save Fee Structure
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="importantDates" title="Important Dates">
          <Card>
            <Card.Body>
              <Form>
                {importantDates.dates.map((date, index) => (
                  <div key={index} className="mb-4 p-3 border rounded">
                    <Row className="mb-3">
                      <Col md={5}>
                        <Form.Group>
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            name={`date-${index}`}
                            value={date.date || ''}
                            onChange={handleImportantDatesChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={5}>
                        <Form.Group>
                          <Form.Label>End Date (Optional)</Form.Label>
                          <Form.Control
                            type="date"
                            name={`endDate-${index}`}
                            value={date.endDate || ''}
                            onChange={handleImportantDatesChange}
                            min={date.date}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2} className="d-flex align-items-end">
                        <Button
                          variant="danger"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveImportantDate(index);
                          }}
                          disabled={importantDates.dates.length === 1}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Time (e.g., 10:00 AM - 4:00 PM)</Form.Label>
                          <Form.Control
                            type="text"
                            name={`time-${index}`}
                            value={date.time || ''}
                            onChange={handleImportantDatesChange}
                            placeholder="e.g., 10:00 AM - 4:00 PM"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={10}>
                        <Form.Group>
                          <Form.Label>Event Title</Form.Label>
                          <Form.Control
                            type="text"
                            name={`description-${index}`}
                            value={date.description || ''}
                            onChange={handleImportantDatesChange}
                            placeholder="Enter event title"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                ))}
                <Button
                  variant="primary"
                  onClick={handleAddImportantDate}
                  className="mb-3"
                >
                  Add Date
                </Button>
                <Button
                  variant="success"
                  onClick={handleSaveImportantDates}
                  disabled={loading}
                >
                  Save Important Dates
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default SettingsManager;
