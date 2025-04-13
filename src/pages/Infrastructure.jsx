import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Infrastructure = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: false,    // Allow animations to trigger on reverse scroll
    });
  }, []);

  const facility = [
    {
      title: "Our Mission",
      content:
        "We aim to nurture and develop the unique talents of each student, preparing them for a successful future.",
      image:
        "https://images.unsplash.com/photo-1666533835045-3a1b3dfc3538?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNjaG9vbCUyMHN0YWZmfGVufDB8fDB8fHww",
      alt: "Mission Image",
    },
    {
      title: "Our Vision",
      content:
        "To be a leading educational institution recognized for excellence in teaching, learning, and student development.",
      image:
        "https://plus.unsplash.com/premium_photo-1683120733115-b9f354c73f65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2Nob29sJTIwc3RhZmZ8ZW58MHx8MHx8fDA%3D",
      alt: "Vision Image",
    },
    {
      title: "Our Values",
      content: "Integrity, Respect, Excellence, Innovation, and Collaboration.",
      image:
        "https://images.unsplash.com/photo-1518707332890-e05af3c6bfff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNjaG9vbCUyMHN0YWZmfGVufDB8fDB8fHww",
      alt: "Values Image",
    },
  ];

  return (
    <>
      {/* <!-- Infrastructure Section --> */}
      <section className="py-5 mt-5 mx-2">
        <div className="container">
          <h2 className="text-center mb-5" data-aos="fade-up">
            Our Infrastructure
          </h2>
          <div className="row">
            {facility.map((facility, index) => (
              <div
                className="col-md-12 mb-4"
                key={index}
                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              >
                <div
                  className={`d-flex align-items-center flex-wrap ${
                    index % 2 === 0 ? "" : "flex-row-reverse"
                  }`}
                >
                  <img
                    src={facility.image}
                    alt={facility.alt}
                    className="img-fluid mb-3 mb-md-0"
                    style={{
                      width: "400px",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <div>
                    <h5>{facility.title}</h5>
                    <p>{facility.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Infrastructure;