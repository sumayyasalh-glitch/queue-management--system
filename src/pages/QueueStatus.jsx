import { useEffect, useState } from 'react';
import { useAppointments } from '../contexts/AppointmentContext';
import '../styles/queue.css';

export default function QueueStatus() {
  const { queue, fetchQueueStatus } = useAppointments();
  const [currentToken, setCurrentToken] = useState(null);
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    fetchQueueStatus();
    const interval = setInterval(fetchQueueStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchQueueStatus]);

  useEffect(() => {
    if (queue.length > 0) {
      const serving = queue.find((q) => q.status === 'serving');
      const waiting = queue.filter((q) => q.status === 'waiting');
      setCurrentToken(serving);
      setWaitingList(waiting);
    }
  }, [queue]);

  const estimatedWaitTime = Math.max(0, waitingList.length * 15);

  return (
    <div className="queue-container">
      <div className="queue-header">
        <h1>Queue Management System</h1>
        <p className="queue-subtitle">Real-time Queue Status</p>
      </div>

      <div className="queue-layout">
        {/* Current Token */}
        <div className="queue-section">
          <div className="section-title">
            <h2>Currently Serving</h2>
          </div>

          {currentToken ? (
            <div className="current-token-card">
              <div className="token-number-large">
                {currentToken.tokenNumber}
              </div>
              <div className="token-details">
                <p className="token-info">
                  <span className="label">Patient:</span>
                  <span className="value">{currentToken.patientName}</span>
                </p>
                <p className="token-info">
                  <span className="label">Counter:</span>
                  <span className="value">{currentToken.counterNumber || 'Assigned'}</span>
                </p>
                <p className="token-info">
                  <span className="label">Time Serving:</span>
                  <span className="value">{currentToken.timeServing || '-'}</span>
                </p>
              </div>
              <div className="token-status-badge serving">
                🔴 Currently Serving
              </div>
            </div>
          ) : (
            <div className="no-data">
              <p>No token currently being served</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="queue-stats">
          <div className="stat-box">
            <div className="stat-label">Total in Queue</div>
            <div className="stat-value">{queue.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Waiting</div>
            <div className="stat-value">{waitingList.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Est. Wait Time</div>
            <div className="stat-value">{estimatedWaitTime} min</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Avg. Service Time</div>
            <div className="stat-value">15 min</div>
          </div>
        </div>
      </div>

      {/* Waiting List */}
      <div className="queue-section waiting-section">
        <div className="section-title">
          <h2>Waiting List</h2>
          <span className="count-badge">{waitingList.length}</span>
        </div>

        {waitingList.length > 0 ? (
          <div className="queue-table-container">
            <table className="queue-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Token</th>
                  <th>Patient Name</th>
                  <th>Phone</th>
                  <th>Time Joined</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {waitingList.map((token, index) => (
                  <tr key={token.id} className={index === 0 ? 'next-up' : ''}>
                    <td className="position">
                      <span className="position-badge">
                        {index + 1}
                        {index === 0 && ' (Next)'}
                      </span>
                    </td>
                    <td className="token-number">
                      <strong>{token.tokenNumber}</strong>
                    </td>
                    <td>{token.patientName}</td>
                    <td>{token.phone || '-'}</td>
                    <td>{new Date(token.createdAt).toLocaleTimeString()}</td>
                    <td>
                      <span className="status-badge waiting">
                        ⏳ Waiting
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <p>No patients waiting</p>
          </div>
        )}
      </div>

      {/* Information Box */}
      <div className="queue-info">
        <h3>📌 Queue Information</h3>
        <ul>
          <li>Each consultation takes approximately 15 minutes</li>
          <li>Queue updates in real-time every 5 seconds</li>
          <li>You can check your appointment status from your dashboard</li>
          <li>Arrive 5 minutes early for your appointment</li>
        </ul>
      </div>
    </div>
  );
}
