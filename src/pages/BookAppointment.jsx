import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../contexts/AppointmentContext';
import { useNotification } from '../contexts/NotificationContext';
import { scheduleAPI } from '../services/api';
import '../styles/appointments.css';

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { createAppointment } = useAppointments();
  const { addNotification } = useNotification();

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await scheduleAPI.getStaff();
        setDoctors(response.data);
      } catch (error) {
        addNotification('Failed to fetch doctors', 'error');
      }
    };
    fetchDoctors();
  }, [addNotification]);

  // Fetch available slots when doctor and date are selected
  useEffect(() => {
    if (formData.doctorId && formData.date) {
      const fetchSlots = async () => {
        try {
          const response = await scheduleAPI.getAvailableSlots(
            formData.doctorId,
            formData.date
          );
          setAvailableSlots(response.data);
        } catch (error) {
          addNotification('Failed to fetch available slots', 'error');
        }
      };
      fetchSlots();
    }
  }, [formData.doctorId, formData.date, addNotification]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.doctorId) {
      addNotification('Please select a doctor', 'error');
      return;
    }
    if (step === 2 && (!formData.date || !formData.time)) {
      addNotification('Please select date and time', 'error');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reason.trim()) {
      addNotification('Please enter reason for appointment', 'error');
      return;
    }

    setLoading(true);

    try {
      await createAppointment({
        doctorId: formData.doctorId,
        dateTime: `${formData.date}T${formData.time}`,
        reason: formData.reason,
      });

      addNotification('Appointment booked successfully!', 'success');
      navigate('/dashboard');
    } catch (error) {
      addNotification(
        error.response?.data?.message || 'Failed to book appointment',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);

  return (
    <div className="appointment-container">
      <div className="appointment-card">
        <h1>Book an Appointment</h1>

        {/* Step Indicator */}
        <div className="steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Select Doctor</p>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Choose Date & Time</p>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Confirm Details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div className="step-content">
              <h2>Select a Doctor</h2>
              <div className="doctor-grid">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`doctor-card ${
                      formData.doctorId === doctor.id ? 'selected' : ''
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        doctorId: doctor.id,
                        date: '',
                        time: '',
                      })
                    }
                  >
                    <div className="doctor-avatar">👨‍⚕️</div>
                    <h3>{doctor.firstName} {doctor.lastName}</h3>
                    <p className="specialization">{doctor.specialization || 'General Practitioner'}</p>
                    <p className="experience">Experience: {doctor.experience || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Date & Time */}
          {step === 2 && (
            <div className="step-content">
              <h2>Choose Date & Time</h2>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getTomorrowDate()}
                  max={getMaxDate()}
                  required
                />
              </div>

              {formData.date && (
                <div className="form-group">
                  <label>Available Time Slots</label>
                  <div className="time-slots">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          className={`time-slot ${
                            formData.time === slot.time ? 'selected' : ''
                          }`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              time: slot.time,
                            })
                          }
                        >
                          {slot.time}
                        </button>
                      ))
                    ) : (
                      <p className="no-slots">No available slots for this date</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirm Details */}
          {step === 3 && (
            <div className="step-content">
              <h2>Confirm Your Appointment</h2>
              <div className="confirmation-summary">
                <div className="summary-item">
                  <span className="label">Doctor</span>
                  <span className="value">
                    {selectedDoctor
                      ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}`
                      : 'Not selected'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Date</span>
                  <span className="value">
                    {formData.date
                      ? new Date(formData.date).toLocaleDateString()
                      : 'Not selected'}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Time</span>
                  <span className="value">{formData.time || 'Not selected'}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Appointment</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Describe your symptoms or reason for visit"
                  rows="4"
                  required
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="button-group">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="btn-secondary">
                Back
              </button>
            )}
            {step < 3 && (
              <button type="button" onClick={handleNext} className="btn-primary">
                Next
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
