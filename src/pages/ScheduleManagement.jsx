import { useState, useEffect } from 'react';
import { scheduleAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/schedule.css';

export default function ScheduleManagement() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    monday: { start: '09:00', end: '17:00', isWorking: true },
    tuesday: { start: '09:00', end: '17:00', isWorking: true },
    wednesday: { start: '09:00', end: '17:00', isWorking: true },
    thursday: { start: '09:00', end: '17:00', isWorking: true },
    friday: { start: '09:00', end: '17:00', isWorking: true },
    saturday: { start: '09:00', end: '13:00', isWorking: false },
    sunday: { start: '09:00', end: '17:00', isWorking: false },
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await scheduleAPI.getStaffSchedule(user?.id);
        setSchedule(response.data);
        if (response.data) {
          setFormData(response.data);
        }
      } catch (error) {
        addNotification('Failed to fetch schedule', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchSchedule();
    }
  }, [user?.id, addNotification]);

  const handleDayChange = (day, field, value) => {
    setFormData({
      ...formData,
      [day]: {
        ...formData[day],
        [field]: value,
      },
    });
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await scheduleAPI.updateSchedule(schedule?.id || user?.id, formData);
      setSchedule(formData);
      setEditMode(false);
      addNotification('Schedule updated successfully!', 'success');
    } catch (error) {
      addNotification('Failed to update schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  if (loading) {
    return <div className="schedule-container">Loading schedule...</div>;
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div>
          <h1>My Work Schedule</h1>
          <p className="schedule-subtitle">
            Manage your availability and working hours
          </p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="btn-edit"
          >
            ✏️ Edit Schedule
          </button>
        )}
      </div>

      <div className="schedule-card">
        {editMode ? (
          <form onSubmit={handleSaveSchedule}>
            <h2>Edit Your Schedule</h2>
            <div className="schedule-grid">
              {days.map((day) => (
                <div key={day} className="day-card">
                  <h3>{dayLabels[day]}</h3>

                  <div className="day-toggle">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData[day].isWorking}
                        onChange={(e) =>
                          handleDayChange(day, 'isWorking', e.target.checked)
                        }
                      />
                      <span>Working Day</span>
                    </label>
                  </div>

                  {formData[day].isWorking && (
                    <div className="time-inputs">
                      <div className="form-group">
                        <label>Start Time</label>
                        <input
                          type="time"
                          value={formData[day].start}
                          onChange={(e) =>
                            handleDayChange(day, 'start', e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>End Time</label>
                        <input
                          type="time"
                          value={formData[day].end}
                          onChange={(e) =>
                            handleDayChange(day, 'end', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {!formData[day].isWorking && (
                    <div className="off-day">Off</div>
                  )}
                </div>
              ))}
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Schedule'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h2>Current Schedule</h2>
            <div className="schedule-view">
              {days.map((day) => (
                <div key={day} className="day-view">
                  <h4>{dayLabels[day]}</h4>
                  {formData[day].isWorking ? (
                    <div className="working-hours">
                      <span className="status-working">🟢 Working</span>
                      <p>
                        {formData[day].start} - {formData[day].end}
                      </p>
                    </div>
                  ) : (
                    <div className="off-hours">
                      <span className="status-off">⚫ Off</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Appointments for this schedule */}
      <div className="upcoming-appointments">
        <h2>Today's Appointments</h2>
        <div className="appointments-list">
          <p className="empty-state">No appointments scheduled for today</p>
        </div>
      </div>
    </div>
  );
}
