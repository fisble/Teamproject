import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminGetUserReports } from '../services/api';
import '../styles/Dashboard.css';

function AdminUserReports() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchUserReports();
  }, [userId, navigate, user.role, fetchUserReports]);

  const fetchUserReports = async () => {
    try {
      setLoading(true);
      const response = await adminGetUserReports(userId);
      setUserData(response.data.user);
      setReports(response.data.reports);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user reports');
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

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-message">{error}</p>
        <Link to="/admin/users" className="nav-link">Back to Users</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>SkillSync AI - User Reports</h1>
        <div className="nav-buttons">
          <span className="user-info">Welcome, {user.name}!</span>
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/admin/users" className="nav-link">Users</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      {userData && (
        <div className="user-info-section">
          <h2>User: {userData.name}</h2>
          <p>Email: {userData.email}</p>
          <p>Total Reports: {reports.length}</p>
        </div>
      )}

      <div className="reports-section">
        <h3>All Reports</h3>
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Role Applied</th>
                <th>Score</th>
                <th>Skills Found</th>
                <th>Missing Skills</th>
                <th>Feedback</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report._id}>
                    <td>{report.role}</td>
                    <td className="score-cell">{report.score}%</td>
                    <td>{report.skillsFound.join(', ') || 'None'}</td>
                    <td>{report.missingSkills.join(', ') || 'None'}</td>
                    <td>{report.feedback}</td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Link to="/admin/users" className="back-link">← Back to Users</Link>
    </div>
  );
}

export default AdminUserReports;
