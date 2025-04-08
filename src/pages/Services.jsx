import React from 'react'

const Services = () => {
  return (
    <>
    <section className="py-5 mt-5">
    <div className="container">
      <h2 className="text-center mb-5">Our Services</h2>
      <div className="row g-4">
        {/* <!-- Service 1 --> */}
        <div className="col-md-4">
          <div className="service-box">
            <i className="bi bi-book service-icon"></i>
            <h5>Comprehensive Curriculum</h5>
            <p>We offer a well-rounded curriculum that caters to the holistic development of our students.</p>
          </div>
        </div>
        {/* <!-- Service 2 --> */}
        <div className="col-md-4">
          <div className="service-box">
            <i className="bi bi-laptop service-icon"></i>
            <h5>Modern Computer Labs</h5>
            <p>Our state-of-the-art computer labs are equipped with the latest technology to enhance learning.</p>
          </div>
        </div>
        {/* <!-- Service 3 --> */}
        <div className="col-md-4">
          <div className="service-box">
            <i className="bi bi-music-note service-icon"></i>
            <h5>Extracurricular Activities</h5>
            <p>We provide a variety of extracurricular activities including music, art, and sports programs.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
    </>
  )
}

export default Services
