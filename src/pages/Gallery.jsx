import React from "react";

const Gallery = () => {
  const images = [
    "https://via.placeholder.com/300x200?text=Image+1",
    "https://via.placeholder.com/300x200?text=Image+2",
    "https://via.placeholder.com/300x200?text=Image+3",
    "https://via.placeholder.com/300x200?text=Image+4",
    "https://via.placeholder.com/300x200?text=Image+5",
    "https://via.placeholder.com/300x200?text=Image+6",
    "https://via.placeholder.com/300x200?text=Image+7",
    "https://via.placeholder.com/300x200?text=Image+8",
    "https://via.placeholder.com/300x200?text=Image+9",
  ];

  return (
    <div className="container py-5 mt-5">
      <h1 className="text-center mb-4">Gallery</h1>
      <p className="text-center text-muted mb-5">
        Explore our collection of moments captured at our school.
      </p>
      <div className="row g-4">
        {images.map((image, index) => (
          <div className="col-md-4" key={index}>
            <div className="card">
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;