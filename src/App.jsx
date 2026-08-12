import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import NotificationCenter from './components/NotificationCenter';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import AppointmentsList from './pages/AppointmentsList';
import QueueStatus from './pages/QueueStatus';
import PatientHistory from './pages/PatientHistory';
import ScheduleManagement from './pages/ScheduleManagement';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppointmentProvider>
            <NotificationCenter />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/appointments/new"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <BookAppointment />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AppointmentsList />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/queue"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <QueueStatus />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PatientHistory />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ScheduleManagement />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppointmentProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
