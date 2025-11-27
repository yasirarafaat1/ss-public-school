import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import "./styles/MobileHoverFix.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Nav from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import GalleryCategory from "./pages/GalleryCategory";
import Staff from "./pages/Staff";
import Infrastructure from "./pages/Infrastructure";
import PageNotFound from "./pages/PageNotFound";
import PrincipalMessage from "./pages/PrincipalMessage";
import Admission from "./pages/Admission";
import AdmissionEnquiry from "./pages/AdmissionEnquiry";
import DeveloperInfo from "./pages/DeveloperInfo";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import SettingsManager from "./components/SettingsManager";

// Layout component to conditionally render Nav and Footer
const AppLayout = () => {
  const location = useLocation();

  const hideNavFooter = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavFooter && <Nav />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:category" element={<GalleryCategory />} />
          <Route path="/principal-message" element={<PrincipalMessage />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/admission/enquiry" element={<AdmissionEnquiry />} />
          <Route path="/developer/info" element={<DeveloperInfo />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/setting" element={<SettingsManager />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      {!hideNavFooter && <Footer />}
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
