import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Define an array of navigation items
  const navItems = [
    { path: "/", label: "Home", icon: "bi bi-house-door" },
    { path: "/about", label: "About Us", icon: "bi bi-info-circle" },
    { path: "/admission", label: "Admission", icon: "bi bi-pencil-square" },
    { path: "/gallery", label: "Gallery", icon: "bi bi-card-image" },
    { path: "/staff", label: "Staff", icon: "bi bi-people" },
    { path: "/contact", label: "Contact", icon: "bi bi-envelope" },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary animated-navbar" data-aos="zoom-in">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="./logo.png"
              alt="Logo"
              // className="me-2"
              style={{ height: "40px" }}
            /> 
            <h2>SS Public School</h2>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {navItems.map((item, index) => (
                <li className="nav-item" key={index}>
                  <a
                    className={`nav-link ${
                      location.pathname === item.path
                        ? "active animate__animated animate__pulse"
                        : ""
                    }`}
                    href={item.path}
                  >
                    <i className={`${item.icon} me-1`}></i> {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;