import React from "react";

const Staff = () => {
  // Define an array of staff members
  const staffMembers = [
    {
      name: "Jane Doe",
      role: "Principal",
      image: "https://media.istockphoto.com/id/1300434912/photo/young-business-woman-got-overjoyed-by-good-news-and-started-celebrating-while-working-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=qE_KkcG9arxtuMq1rwNNGpVIUp2fd02nJIs7lkWLZhg=",
      social: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
      },
    },
    {
      name: "John Smith",
      role: "Vice Principal",
      image: "https://media.istockphoto.com/id/1992829731/photo/portrait-of-a-happy-teacher-smiling-at-the-university.webp?a=1&b=1&s=612x612&w=0&k=20&c=nbrwmYzoJfC-v-cG0aigS5cmmEImp8EQ5N7pyTU1tEU=",
      social: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
      },
    },
    {
      name: "Emily Johnson",
      role: "Head of Admissions",
      image: "https://media.istockphoto.com/id/1312139041/photo/learning-on-the-job.webp?a=1&b=1&s=612x612&w=0&k=20&c=QedI4W1AwyUDcNzuHAjT_rBNE6c69a1F6_4W3t6OtE0=",
      social: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
      },
    },
  ];

  return (
    <div>
      <>
        {/* <!-- Staff Section --> */}
        <section className="py-5 mt-5">
          <div className="container">
            <h2 className="text-center mb-5">Meet Our Staff</h2>
            <div className="row">
              {staffMembers.map((staff, index) => (
                <div className="col-md-4" key={index}>
                  <div className="staff-member text-center">
                    <img
                      src={staff.image}
                      alt={staff.name}
                      className="img-fluid rounded-circle mb-3"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                    <h5>{staff.name}</h5>
                    <p>{staff.role}</p>
                    <div className="social-icons">
                      <a href={staff.social.twitter} className="me-2">
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a href={staff.social.facebook} className="me-2">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href={staff.social.linkedin}>
                        <i className="bi bi-linkedin"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    </div>
  );
};

export default Staff;