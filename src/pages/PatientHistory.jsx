import { useEffect, useState } from 'react';
import { historyAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import '../styles/history.css';

export default function PatientHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await historyAPI.getHistory();
        setHistory(response.data);
      } catch (error) {
        addNotification('Failed to fetch history', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [addNotification]);

  const filteredHistory = history.filter((record) => {
    const matchesStatus =
      filterStatus === 'all' || record.status === filterStatus;

    let matchesMonth = true;
    if (filterMonth !== 'all') {
      const recordMonth = new Date(record.dateTime).toISOString().slice(0, 7);
      matchesMonth = recordMonth === filterMonth;
    }

    return matchesStatus && matchesMonth;
  });

  const stats = {
    total: history.length,
    completed: history.filter((r) => r.status === 'completed').length,
    cancelled: history.filter((r) => r.status === 'cancelled').length,
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>My Appointment History</h1>
        <p className="history-subtitle">View all past appointments and consultations</p>
      </div>

      {/* Statistics */}
      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Visits</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Month</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            <option value="2024-12">December 2024</option>
            <option value="2024-11">November 2024</option>
            <option value="2024-10">October 2024</option>
            <option value="2024-09">September 2024</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="history-content">
        {loading ? (
          <div className="loading">Loading appointment history...</div>
        ) : filteredHistory.length > 0 ? (
          <div className="history-list">
            {filteredHistory.map((record) => (
              <div key={record.id} className="history-card">
                <div className="history-card-header">
                  <div className="card-title">
                    <h3>{record.doctorName || record.staffName}</h3>
                    <p className="date-time">
                      {new Date(record.dateTime).toLocaleDateString()} at{' '}
                      {new Date(record.dateTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span
                    className={`status-badge ${record.status}`}
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>

                <div className="history-card-body">
                  {record.reason && (
                    <div className="history-item">
                      <span className="label">Reason for Visit:</span>
                      <p>{record.reason}</p>
                    </div>
                  )}

                  {record.notes && (
                    <div className="history-item">
                      <span className="label">Doctor's Notes:</span>
                      <p>{record.notes}</p>
                    </div>
                  )}

                  {record.diagnosis && (
                    <div className="history-item">
                      <span className="label">Diagnosis:</span>
                      <p>{record.diagnosis}</p>
                    </div>
                  )}

                  {record.prescription && (
                    <div className="history-item">
                      <span className="label">Prescription:</span>
                      <p>{record.prescription}</p>
                    </div>
                  )}

                  <div className="history-footer">
                    <span className="token-info">
                      {record.tokenNumber && `Token: #${record.tokenNumber}`}
                    </span>
                    <span className="duration-info">
                      {record.duration && `Duration: ${record.duration} min`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>No appointment history found</p>
          </div>
        )}
      </div>
    </div>
  );
}
