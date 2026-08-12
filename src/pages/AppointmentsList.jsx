import { useEffect, useState } from 'react';
import { useAppointments } from '../contexts/AppointmentContext';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/appointments-list.css';

export default function AppointmentsList() {
  const { user } = useAuth();
  const { appointments, fetchAppointments, cancelAppointment, rescheduleAppointment } = useAppointments();
  const { addNotification } = useNotification();
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = appointments.filter((apt) => {
    return filterStatus === 'all' || apt.status === filterStatus;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.dateTime) - new Date(b.dateTime);
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(id);
        addNotification('Appointment cancelled successfully', 'success');
      } catch (error) {
        addNotification('Failed to cancel appointment', 'error');
      }
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      newDate: appointment.dateTime.split('T')[0],
      newTime: appointment.dateTime.split('T')[1],
    });
    setShowRescheduleModal(true);
  };

  const handleSaveReschedule = async () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime) {
      addNotification('Please select date and time', 'error');
      return;
    }

    try {
      await rescheduleAppointment(selectedAppointment.id, {
        newDateTime: `${rescheduleData.newDate}T${rescheduleData.newTime}`,
      });
      addNotification('Appointment rescheduled successfully', 'success');
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      addNotification('Failed to reschedule appointment', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'completed':
        return '✔️';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <div className="appointments-list-container">
      <div className="appointments-header">
        <h1>Appointments</h1>
        <p className="subtitle">
          {user?.role === 'patient'
            ? 'View and manage your appointments'
            : 'View and manage patient appointments'}
        </p>
      </div>

      {/* Filters and Sorting */}
      <div className="appointments-controls">
        <div className="filter-group">
          <label>Filter by Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="appointments-content">
        {sortedAppointments.length > 0 ? (
          <div className="appointments-grid">
            {sortedAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="card-header">
                  <div className="title-section">
                    <span className="status-icon">
                      {getStatusIcon(appointment.status)}
                    </span>
                    <div>
                      <h3>
                        {user?.role === 'patient'
                          ? appointment.doctorName || appointment.staffName
                          : appointment.patientName}
                      </h3>
                      <p className="appointment-id">ID: {appointment.id}</p>
                    </div>
                  </div>
                  <span
                    className={`status-badge ${appointment.status}`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>

                <div className="card-body">
                  <div className="detail-item">
                    <span className="label">📅 Date & Time</span>
                    <span className="value">
                      {new Date(appointment.dateTime).toLocaleDateString()} at{' '}
                      {new Date(appointment.dateTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {appointment.reason && (
                    <div className="detail-item">
                      <span className="label">📝 Reason</span>
                      <span className="value">{appointment.reason}</span>
                    </div>
                  )}

                  {appointment.location && (
                    <div className="detail-item">
                      <span className="label">📍 Location</span>
                      <span className="value">{appointment.location}</span>
                    </div>
                  )}

                  {appointment.tokenNumber && (
                    <div className="detail-item">
                      <span className="label">🎫 Token</span>
                      <span className="value">#{appointment.tokenNumber}</span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  {appointment.status === 'pending' ||
                  appointment.status === 'confirmed' ? (
                    <>
                      <button
                        onClick={() => handleReschedule(appointment)}
                        className="btn-reschedule"
                        title="Reschedule this appointment"
                      >
                        📅 Reschedule
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="btn-cancel"
                        title="Cancel this appointment"
                      >
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <span className="no-action">No actions available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments">
            <p>No appointments found</p>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reschedule Appointment</h2>
            <p className="modal-subtitle">
              {selectedAppointment.doctorName || selectedAppointment.staffName} -{' '}
              {new Date(selectedAppointment.dateTime).toLocaleDateString()}
            </p>

            <div className="form-group">
              <label>New Date</label>
              <input
                type="date"
                value={rescheduleData.newDate}
                onChange={(e) =>
                  setRescheduleData({
                    ...rescheduleData,
                    newDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>New Time</label>
              <input
                type="time"
                value={rescheduleData.newTime}
                onChange={(e) =>
                  setRescheduleData({
                    ...rescheduleData,
                    newTime: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-buttons">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
