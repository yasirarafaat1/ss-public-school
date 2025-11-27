import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Modal,
  Alert,
  Spinner,
  Image,
} from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaUserTie,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUpload,
} from "react-icons/fa";
import {
  getStaffMembers,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from "../services/adminService";
import { supabase } from "../services/supabaseService";

const StaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    qualification: "",
    contact: "",
    email: "",
    image: "/logo.png",
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch staff members
  const fetchStaff = async () => {
    setLoading(true);
    setError("");
    try {
      const staffData = await getStaffMembers();
      setStaff(staffData);
    } catch (err) {
      console.error("Error fetching staff:", err);
      // Handle specific error cases
      if (
        err.message &&
        (err.message.includes("row-level security") ||
          err.message.includes("403"))
      ) {
        setError(err.message);
      } else {
        setError("Failed to load staff members. Please try again.");
      }
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

    if (name.includes("social.")) {
      const socialField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, JPG, PNG, GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `staff/${fileName}`;

      // Check available buckets and use the first available one
      let bucketName = "public";
      try {
        const { data: buckets, error: bucketError } =
          await supabase.storage.listBuckets();

        if (bucketError) {
          console.warn("Could not list buckets:", bucketError);
        } else if (buckets && buckets.length > 0) {
          // Use 'images' bucket if it exists, otherwise use the first available bucket
          const imagesBucket = buckets.find(
            (bucket) => bucket.name === "images"
          );
          bucketName = imagesBucket ? imagesBucket.name : buckets[0].name;
        } else {
          // If no buckets exist, we'll try to upload without specifying a bucket
          // and handle the error gracefully
          console.warn("No storage buckets found");
        }
      } catch (bucketError) {
        console.warn(
          "Error listing buckets, will try direct upload:",
          bucketError
        );
      }

      // Try to upload to the selected bucket
      let data, error;
      try {
        const result = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);
        data = result.data;
        error = result.error;
      } catch (uploadError) {
        console.warn("Bucket upload failed:", uploadError);
        // If bucket upload fails, fall back to base64 encoding
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) =>
            reject(new Error("Failed to process image file."));
          reader.readAsDataURL(file);
        });

        // Update form data with base64 image
        setFormData((prev) => ({
          ...prev,
          image: base64Image,
        }));

        setSuccess("Image processed successfully (stored locally)");
        setTimeout(() => setSuccess(""), 3000);
        return; // Exit early as we're using base64
      }

      if (error) {
        // If we get a bucket error, fall back to base64
        if (error.message && error.message.includes("Bucket")) {
          const base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) =>
              reject(new Error("Failed to process image file."));
            reader.readAsDataURL(file);
          });

          // Update form data with base64 image
          setFormData((prev) => ({
            ...prev,
            image: base64Image,
          }));

          setSuccess("Image processed successfully (stored locally)");
          setTimeout(() => setSuccess(""), 3000);
          return; // Exit early as we're using base64
        }
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      // Update form data with new image URL
      setFormData((prev) => ({
        ...prev,
        image: publicUrl,
      }));

      setSuccess("Image uploaded successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields including image
    if (!formData.name.trim()) {
      setError("Name is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.role.trim()) {
      setError("Role is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setIsSubmitting(false);
      return;
    }

    // Check if image is the default placeholder (meaning no image was uploaded)
    if (!formData.image || formData.image === "/logo.png") {
      setError("Please upload a staff member image");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare staff data
      const staffData = {
        name: formData.name.trim(),
        role: formData.role,
        qualification: formData.qualification,
        contact: formData.contact,
        email: formData.email,
        // Use uploaded image or default
        image_url: formData.image || "/logo.png",
      };

      // If updating, call update function, else create new
      if (editingId) {
        await updateStaffMember(editingId, staffData);
        setSuccess("Staff member updated successfully.");
      } else {
        await addStaffMember(staffData);
        setSuccess("Staff member added successfully.");
      }

      setShowModal(false);
      fetchStaff();
    } catch (err) {
      console.error("Error saving staff member:", err);

      // Handle specific error cases
      if (err.message && err.message.includes("row-level security")) {
        setError(
          "You don't have permission to modify staff data. Please contact your administrator."
        );
      } else if (err.message && err.message.includes("403")) {
        setError(
          "Access denied. Please check your authentication and permissions."
        );
      } else {
        setError(
          err.message || "Failed to save staff member. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = (staffMember) => {
    setFormData({
      name: staffMember.name || "",
      role: staffMember.role || "",
      qualification: staffMember.qualification || "",
      contact: staffMember.contact || "",
      email: staffMember.email || "",
      image: staffMember.image_url || staffMember.image || "/logo.png",
    });
    setEditingId(staffMember.id);
    setShowModal(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaffMember(id);
        setSuccess("Staff member deleted successfully!");
        fetchStaff();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Error deleting staff member:", err);
        setError("Failed to delete staff member. Please try again.");
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: "",
      role: "",
      qualification: "",
      contact: "",
      email: "",
      image: "/logo.png",
    });
    setEditingId(null);
  };

  // Get role icon
  const getRoleIcon = (role) => {
    if (!role) return <FaUserGraduate className="text-muted me-2" />;
    if (role.toLowerCase().includes("principal"))
      return <FaUserTie className="text-primary me-2" />;
    if (
      role.toLowerCase().includes("teacher") ||
      role.toLowerCase().includes("head")
    )
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

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}

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
            <p className="text-muted">
              Click the button above to add a new staff member
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {staff.map((member) => (
            <Col key={member.id}>
              <Card className="h-100">
                <div className="position-relative">
                  <Image
                    src={member.image_url || member.image || "/logo.png"}
                    alt={member.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/logo.png";
                    }}
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
                  <Card.Title className="d-flex align-items-center">
                    {getRoleIcon(member.role)}
                    {member.name}
                  </Card.Title>
                  <Card.Text>
                    <strong>{member.role}</strong>
                    <br />
                    {member.qualification && (
                      <>
                        <small className="text-muted">
                          {member.qualification}
                        </small>
                        <br />
                      </>
                    )}
                    {member.email && (
                      <small>
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </small>
                    )}
                    {member.contact && (
                      <>
                        <br />
                        <small>
                          <a href={`tel:${member.contact}`}>{member.contact}</a>
                        </small>
                      </>
                    )}
                  </Card.Text>
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
            <Modal.Title>
              {editingId ? "Edit Staff Member" : "Add New Staff Member"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} className="text-center mb-3">
                <div className="position-relative d-inline-block">
                  <div className="position-relative">
                    <Image
                      src={formData.image || "/logo.png"}
                      alt="Staff"
                      rounded
                      className="mb-3"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "/logo.png";
                      }}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={triggerFileInput}
                      disabled={uploading}
                      className="position-absolute bottom-0 end-0"
                    >
                      {uploading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <FaUpload />
                      )}
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    Upload a clear photo of the staff member (Max 5MB)
                  </Form.Text>
                </div>
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formName" className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
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
                      <Form.Label>Role/Position *</Form.Label>
                      <Form.Control
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder="e.g., Teacher, Principal"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formQualification" className="mb-3">
                      <Form.Label>Qualification</Form.Label>
                      <Form.Control
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        placeholder="e.g., M.Sc, B.Ed"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formContact" className="mb-3">
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="e.g., +1234567890"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="formEmail" className="mb-3">
                      <Form.Label>Email Address *</Form.Label>
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
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={
                !formData.name ||
                !formData.role ||
                !formData.email ||
                isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    size="sm"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {editingId ? "Updating..." : "Adding..."}
                </>
              ) : editingId ? (
                "Update"
              ) : (
                "Add Staff"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManager;
