
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <header className="hero">
        <h1>Welcome to Our Website</h1>
        <p>Your one-stop destination for amazing content</p>
      </header>
      
      <main>
        <section className="features">
          <div className="feature-card">
            <h2>Quality Service</h2>
            <p>We provide the best service in the industry</p>
          </div>
          <div className="feature-card">
            <h2>Expert Team</h2>
            <p>Our team of professionals is here to help</p>
          </div>
          <div className="feature-card">
            <h2>24/7 Support</h2>
            <p>Round the clock customer support</p>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
