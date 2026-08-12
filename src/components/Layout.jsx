import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/layout.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const patientMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/appointments/new', label: 'Book Appointment', icon: '➕' },
    { path: '/appointments', label: 'My Appointments', icon: '📋' },
    { path: '/queue', label: 'Queue Status', icon: '🎫' },
    { path: '/history', label: 'My History', icon: '📝' },
  ];

  const staffMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/appointments', label: 'Appointments', icon: '👥' },
    { path: '/schedule', label: 'My Schedule', icon: '⏰' },
    { path: '/queue', label: 'Queue Management', icon: '🎫' },
  ];

  const menuItems =
    user?.role === 'patient' ? patientMenuItems : staffMenuItems;

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="logo">
            <span className="logo-icon">🏥</span>
            {sidebarOpen && <span className="logo-text">QueueCare</span>}
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path)}`}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className={`user-info ${!sidebarOpen ? 'collapsed' : ''}`}>
            {sidebarOpen && (
              <>
                <div className="user-avatar">👤</div>
                <div className="user-details">
                  <p className="user-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="user-role">
                    {user?.role?.charAt(0).toUpperCase() +
                      user?.role?.slice(1)}
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn"
            title="Logout"
          >
            {sidebarOpen ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle navigation"
            >
              ☰
            </button>
          </div>
          <div className="topbar-right">
            <span className="status-indicator">🟢 Online</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
