import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminGetAllReports } from '../services/api';
import '../styles/Dashboard.css';

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      const response = await adminGetAllReports();
      setReports(response.data.reports);
      setFilteredReports(response.data.reports);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === 'all') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter((report) => report.role === selectedFilter));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  // Get unique roles for filter dropdown
  const uniqueRoles = ['all', ...new Set(reports.map((report) => report.role))];

  if (loading) {
    return <div className="dashboard-container"><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>SkillSync AI - All Reports</h1>
        <div className="nav-buttons">
          <span className="user-info">Welcome, {user.name}!</span>
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/admin/users" className="nav-link">Users</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-section">
        <label>Filter by Role:</label>
        <select value={filter} onChange={handleFilterChange} className="filter-select">
          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role === 'all' ? 'All Roles' : role}
            </option>
          ))}
        </select>
      </div>

      <div className="reports-section">
        <h2>All Reports ({filteredReports.length})</h2>
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role Applied</th>
                <th>Score</th>
                <th>Skills Found</th>
                <th>Missing Skills</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report._id}>
                    <td>{report.userId?.name || 'N/A'}</td>
                    <td>{report.userId?.email || 'N/A'}</td>
                    <td>{report.role}</td>
                    <td className="score-cell">{report.score}%</td>
                    <td>{report.skillsFound.join(', ') || 'None'}</td>
                    <td>{report.missingSkills.join(', ') || 'None'}</td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
