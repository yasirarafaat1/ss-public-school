import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { staffMembers } from "../data/data"; // Import staff members from the data file

gsap.registerPlugin(ScrollTrigger);

const Staff = () => {
  const staffRef = useRef(null);

  useEffect(() => {
    // Animate staff cards
    gsap.fromTo(
      staffRef.current.querySelectorAll(".staff-member"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: staffRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div>
      <section className="py-5 mt-5">
        <div className="container">
          <h2 className="text-center mb-5">Meet Our Staff</h2>
          <div className="row" ref={staffRef}>
            {staffMembers.map((staff, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="staff-member text-center">
                  <div
                    className="profile-pic-container mb-3"
                    style={{
                      width: "150px",
                      height: "150px",
                      margin: "0 auto",
                      overflow: "hidden",
                      position: "relative",
                      borderRadius: "8px", // Square shape with rounded corners
                    }}
                  >
                    <img
                      src={staff.image}
                      alt={staff.name}
                      className="img-fluid profile-pic"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                  <h5>{staff.name}</h5>
                  <p>{staff.role}</p>
                  <div className="social-icons">
                    {staff.social.twitter && (
                      <a
                        href={staff.social.twitter}
                        className="me-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-twitter"></i>
                      </a>
                    )}
                    {staff.social.facebook && (
                      <a
                        href={staff.social.facebook}
                        className="me-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-facebook"></i>
                      </a>
                    )}
                    {staff.social.linkedin && (
                      <a
                        href={staff.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-linkedin"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add hover animation using inline styles */}
      <style>
        {`
          .profile-pic-container:hover .profile-pic {
            transform: scale(1.1); /* Zoom effect on hover */
          }
        `}
      </style>
    </div>
  );
};

export default Staff;