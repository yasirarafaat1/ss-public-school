import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { EmojiFrown, HouseDoor, ArrowLeft } from 'react-bootstrap-icons';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found - School Name</title>
      </Helmet>
      
      <div className="container-fluid min-vh-100 d-flex align-items-center bg-gradient-primary">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center text-black">
              
              {/* Error Code */}
              <h1 className="display-1 fw-bold mb-4">
                4<EmojiFrown className="mx-2"/>4
              </h1>

              {/* Main Message */}
              <h2 className="h2 mb-3">Oops! Page Not Found</h2>
              <p className="lead mb-5">
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
              </p>

              {/* Action Buttons */}
              <div className="d-flex gap-3 justify-content-center">
                <Link 
                  to="/" 
                  className="btn btn-light btn-lg rounded-pill px-4"
                >
                  <HouseDoor className="me-2" />
                  Back to Home
                </Link>
                
                <button 
                  onClick={() => window.history.back()} 
                  className="btn btn-light btn-lg rounded-pill px-4 text-black"
                >
                  <ArrowLeft className="me-2" />
                  Previous Page
                </button>
              </div>

              {/* Additional Help */}
              <div className="mt-5 text-black">
                <p className="small">
                  Still having trouble? Contact us at{' '}
                  <a href="mailto:support@school.edu" className="text-black">
                    support@school.edu
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;