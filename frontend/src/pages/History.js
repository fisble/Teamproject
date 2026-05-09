import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/api';
import '../styles/History.css';

function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getHistory();
      setReports(response.data.reports);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="history-container">
      <header className="history-header">
        <h1>Analysis History</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="history-content">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading history...</div>
        ) : reports.length === 0 ? (
          <div className="no-reports">
            <p>No analysis records yet. Start by analyzing a resume!</p>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report._id} className="report-card">
                <div className="report-header">
                  <h3>{report.role}</h3>
                  <span className="score-badge">{report.score}%</span>
                </div>
                <div className="report-date">
                  {formatDate(report.createdAt)}
                </div>
                <div className="report-summary">
                  <p><strong>Skills Found:</strong> {report.skillsFound.length}</p>
                  <p><strong>Missing Skills:</strong> {report.missingSkills.length}</p>
                </div>
                <div className="report-feedback">
                  <p>{report.feedback.substring(0, 100)}...</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
