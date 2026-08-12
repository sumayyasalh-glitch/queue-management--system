import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { appointmentAPI, queueAPI } from '../services/api';

const AppointmentContext = createContext();

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queue, setQueue] = useState([]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await appointmentAPI.getAll();
      setAppointments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQueueStatus = useCallback(async () => {
    try {
      const response = await queueAPI.getQueueStatus();
      setQueue(response.data);
    } catch (err) {
      console.error('Failed to fetch queue status:', err);
    }
  }, []);

  const createAppointment = useCallback(async (data) => {
    setError(null);
    try {
      const response = await appointmentAPI.create(data);
      setAppointments([...appointments, response.data]);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create appointment';
      setError(errorMessage);
      throw err;
    }
  }, [appointments]);

  const cancelAppointment = useCallback(async (id) => {
    setError(null);
    try {
      const response = await appointmentAPI.cancel(id);
      setAppointments(
        appointments.map((apt) => (apt.id === id ? response.data : apt))
      );
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel appointment';
      setError(errorMessage);
      throw err;
    }
  }, [appointments]);

  const rescheduleAppointment = useCallback(async (id, data) => {
    setError(null);
    try {
      const response = await appointmentAPI.reschedule(id, data);
      setAppointments(
        appointments.map((apt) => (apt.id === id ? response.data : apt))
      );
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reschedule appointment';
      setError(errorMessage);
      throw err;
    }
  }, [appointments]);

  // Poll for queue updates every 5 seconds
  useEffect(() => {
    fetchQueueStatus();
    const interval = setInterval(fetchQueueStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchQueueStatus]);

  const value = {
    appointments,
    loading,
    error,
    queue,
    fetchAppointments,
    fetchQueueStatus,
    createAppointment,
    cancelAppointment,
    rescheduleAppointment,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
