import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Staff from "./pages/Staff";
import Infrastructure from "./pages/Infrastructure";
import PageNotFound from "./pages/PageNotFound";
import PrincipalMessage from "./pages/PrincipalMessage";
import Admission from "./pages/Admission";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DeveloperInfo from "./pages/DeveloperInfo";

// Layout component to conditionally render Nav and Footer
const AppLayout = () => {
  const location = useLocation();
  
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/principal-message" element={<PrincipalMessage />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/developer-info" element={<DeveloperInfo />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="app-container">
        <AppLayout />
      </div>
    </Router>
  );
}