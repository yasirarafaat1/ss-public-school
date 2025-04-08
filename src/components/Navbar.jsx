import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Define an array of navigation items
  const navItems = [
    { path: "/", label: "Home", icon: "bi bi-house-door" },
    { path: "/staff", label: "Staff", icon: "bi bi-people" },
    { path: "/infrastructure", label: "Infrastructure", icon: "bi bi-building" },
    { path: "/services", label: "Service", icon: "bi bi-envelope" },
    { path: "/about", label: "About Us", icon: "bi bi-info-circle" },
    { path: "/contact", label: "Contact", icon: "bi bi-envelope" },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary animated-navbar" data-aos="zoom-in">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="./generated-icon.png"
              alt="Logo"
              className="me-2"
              style={{ height: "30px" }}
            />
            <i className="bi bi-mortarboard-fill me-2"></i> MySchool
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