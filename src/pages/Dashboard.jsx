import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../contexts/AppointmentContext';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { appointments, queue, fetchAppointments, fetchQueueStatus } = useAppointments();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchQueueStatus();
  }, [fetchAppointments, fetchQueueStatus]);

  useEffect(() => {
    const upcoming = appointments
      .filter((apt) => apt.status === 'confirmed' || apt.status === 'pending')
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
      .slice(0, 3);
    setUpcomingAppointments(upcoming);
  }, [appointments]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>{getGreeting()}, {user?.firstName}!</h1>
          <p className="dashboard-subtitle">
            {user?.role === 'patient'
              ? 'Manage your appointments and view the queue'
              : 'Manage appointments and schedules'}
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <h3>{upcomingAppointments.length}</h3>
            <p>Upcoming Appointments</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎫</div>
            <h3>{queue.length || 0}</h3>
            <p>Queue Tokens</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <h3>{Math.max(0, (queue.length - 1) * 15 || 0)}</h3>
            <p>Est. Wait Time (min)</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <h3>{appointments.filter((a) => a.status === 'completed').length}</h3>
            <p>Completed Visits</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-section">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            {user?.role === 'patient' && (
              <>
                <Link to="/appointments/new" className="action-card primary">
                  <div className="action-icon">➕</div>
                  <h3>Book Appointment</h3>
                  <p>Schedule a new appointment</p>
                </Link>
                <Link to="/queue" className="action-card">
                  <div className="action-icon">📊</div>
                  <h3>View Queue</h3>
                  <p>Check current queue status</p>
                </Link>
                <Link to="/history" className="action-card">
                  <div className="action-icon">📝</div>
                  <h3>My History</h3>
                  <p>View past appointments</p>
                </Link>
              </>
            )}
            {(user?.role === 'doctor' || user?.role === 'staff') && (
              <>
                <Link to="/appointments" className="action-card primary">
                  <div className="action-icon">👥</div>
                  <h3>View Appointments</h3>
                  <p>Manage today's appointments</p>
                </Link>
                <Link to="/schedule" className="action-card">
                  <div className="action-icon">⏰</div>
                  <h3>My Schedule</h3>
                  <p>Manage your availability</p>
                </Link>
                <Link to="/queue" className="action-card">
                  <div className="action-icon">🎫</div>
                  <h3>Queue Management</h3>
                  <p>Manage queue tokens</p>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="upcoming-section">
          <h2>Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="appointment-list">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="appointment-item">
                  <div className="appointment-time">
                    <div className="time">
                      {new Date(apt.dateTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="appointment-details">
                    <h4>{apt.doctorName || apt.staffName}</h4>
                    <p>{new Date(apt.dateTime).toLocaleDateString()}</p>
                    <span className={`status-badge ${apt.status}`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No upcoming appointments</p>
          )}
        </div>
      </div>
    </div>
  );
}
