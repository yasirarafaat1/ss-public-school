import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Row, Col, Modal, Alert, Spinner, Image } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUserTie, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import { 
  getStaffMembers, 
  addStaffMember, 
  updateStaffMember, 
  deleteStaffMember 
} from '../services/adminService';
import { uploadFile } from '../services/firebaseService';

const StaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    qualification: '',
    contact: '',
    email: '',
    image: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch staff members
  const fetchStaff = async () => {
    setLoading(true);
    setError('');
    try {
      const staffData = await getStaffMembers();
      setStaff(staffData);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: previewUrl
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      let imageUrl = formData.image;
      
      // If a new file is selected, upload it
      if (selectedFile) {
        const uploadResult = await uploadFile(selectedFile, 'staff-photos');
        if (uploadResult.success) {
          imageUrl = uploadResult.downloadURL;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      const staffData = {
        ...formData,
        image: imageUrl
      };

      if (editingId) {
        await updateStaffMember(editingId, staffData);
        setSuccess('Staff member updated successfully!');
      } else {
        await addStaffMember(staffData);
        setSuccess('Staff member added successfully!');
      }
      
      setShowModal(false);
      setSelectedFile(null);
      fetchStaff();
    } catch (err) {
      console.error('Error saving staff member:', err);
      setError(err.message || 'Failed to save staff member. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (staffMember) => {
    setFormData({
      name: staffMember.name || '',
      role: staffMember.role || '',
      qualification: staffMember.qualification || '',
      contact: staffMember.contact || '',
      email: staffMember.email || '',
      image: staffMember.image || ''
    });
    setEditingId(staffMember.id);
    setShowModal(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteStaffMember(id);
        setSuccess('Staff member deleted successfully!');
        fetchStaff();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting staff member:', err);
        setError('Failed to delete staff member. Please try again.');
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      role: '',
      qualification: '',
      contact: '',
      email: '',
      image: ''
    });
    setEditingId(null);
  };

  // Get role icon
  const getRoleIcon = (role) => {
    if (!role) return <FaUserGraduate className="text-muted me-2" />;
    if (role.toLowerCase().includes('principal')) return <FaUserTie className="text-primary me-2" />;
    if (role.toLowerCase().includes('teacher') || role.toLowerCase().includes('head')) 
      return <FaChalkboardTeacher className="text-success me-2" />;
    return <FaUserGraduate className="text-muted me-2" />;
  };

  return (
    <div className="staff-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manage Staff Members</h4>
        <Button 
          variant="primary" 
          onClick={() => {
            handleReset();
            setShowModal(true);
          }}
        >
          <FaPlus className="me-2" /> Add Staff Member
        </Button>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading staff members...</p>
        </div>
      ) : staff.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <FaUserTie className="display-4 text-muted mb-3" />
            <h5>No staff members found</h5>
            <p className="text-muted">Click the button above to add a new staff member</p>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {staff.map((member) => (
            <Col key={member.id}>
              <Card className="h-100">
                <div className="position-relative">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 p-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-1"
                      onClick={() => handleEdit(member)}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-1">{member.name}</h5>
                      <p className="text-muted mb-0 d-flex align-items-center">
                        {getRoleIcon(member.role)}
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <p className="small text-muted mb-2">
                    <i className="bi bi-mortarboard me-2"></i>
                    {member.qualification}
                  </p>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {member.contact && (
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="d-flex align-items-center"
                        href={`tel:${member.contact}`}
                      >
                        <i className="bi bi-telephone me-1"></i>
                        <span>Call</span>
                      </Button>
                    )}
                    {member.email && (
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="d-flex align-items-center"
                        href={`mailto:${member.email}`}
                      >
                        <i className="bi bi-envelope me-1"></i>
                        <span>Email</span>
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add/Edit Staff Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Edit Staff Member' : 'Add New Staff Member'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} className="text-center mb-3">
                <div className="position-relative d-inline-block">
                  <Image 
                    src={formData.image} 
                    alt="Staff" 
                    rounded 
                    className="mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <Form.Group controlId="formImage" className="mt-2">
                  <Form.Label>Upload Photo</Form.Label>
                  <Form.Control 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-2"
                  />
                  <Form.Text className="text-muted">
                    {selectedFile ? selectedFile.name : 'No file chosen'}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formName" className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formRole" className="mb-3">
                      <Form.Label>Role/Position</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder="e.g., Math Teacher"
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="formQualification" className="mb-3">
                  <Form.Label>Qualifications</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="e.g., M.Sc, B.Ed, Ph.D"
                    required 
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formContact" className="mb-3">
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control 
                        type="tel" 
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="e.g., +91 98765 43210"
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formEmail" className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g., staff@example.com"
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={!formData.name || !formData.role || uploading}
            >
              {uploading ? (
                <>
                  <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" className="me-2" />
                  {editingId ? 'Updating...' : 'Uploading...'}
                </>
              ) : editingId ? 'Update' : 'Add Staff'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManager;
