import { Link } from 'react-router-dom';
import '../styles/home.css';

export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1 className="header-title">Welcome to QueueCare</h1>
          <p className="header-subtitle">
            Smart appointment and queue management system
          </p>
        </div>
      </header>

      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Appointments</h3>
            <p>Book appointments online in just a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Digital Queue Tokens</h3>
            <p>No more waiting in line - get your token digitally</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Live Queue Updates</h3>
            <p>Real-time updates on your position in the queue</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Visit History</h3>
            <p>Keep track of all your past appointments and records</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Smart Notifications</h3>
            <p>Get instant notifications about your appointments</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Staff Management</h3>
            <p>Manage doctor schedules and availability</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up as a patient, doctor, or staff member</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Book Appointment</h3>
            <p>Select your preferred doctor and time slot</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Token</h3>
            <p>Receive a digital queue token on appointment day</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track Queue</h3>
            <p>Monitor your position in real-time</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of users managing their appointments efficiently</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn-primary-large">
            Create Account
          </Link>
          <Link to="/login" className="btn-secondary-large">
            Sign In
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2024 QueueCare. All rights reserved.</p>
      </footer>
    </div>
  );
}
