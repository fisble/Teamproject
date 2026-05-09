import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminGetDashboardStats } from '../services/api';
import '../styles/Dashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchDashboardStats();
  }, [navigate, user.role]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminGetDashboardStats();
      setStats(response.data.stats);
      setRecentReports(response.data.recentReports);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>SkillSync AI - Admin Dashboard</h1>
        <div className="nav-buttons">
          <span className="user-info">Welcome, {user.name}!</span>
          <Link to="/admin/users" className="nav-link">Users</Link>
          <Link to="/admin/reports" className="nav-link">All Reports</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Reports</h3>
          <p className="stat-number">{stats?.totalReports || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p className="stat-number">{stats?.averageScore || 0}%</p>
        </div>
      </div>

      <div className="recent-reports-section">
        <h2>Recent Reports</h2>
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role Applied</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <tr key={report._id}>
                    <td>{report.userId?.name || 'N/A'}</td>
                    <td>{report.userId?.email || 'N/A'}</td>
                    <td>{report.role}</td>
                    <td className="score-cell">{report.score}%</td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No reports yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
