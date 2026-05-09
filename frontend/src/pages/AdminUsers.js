import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminGetAllUsers, adminSearchUsers } from '../services/api';
import '../styles/Dashboard.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminGetAllUsers();
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    try {
      const response = await adminSearchUsers(query);
      setFilteredUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
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
        <h1>SkillSync AI - Admin Users</h1>
        <div className="nav-buttons">
          <span className="user-info">Welcome, {user.name}!</span>
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/admin/reports" className="nav-link">All Reports</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      {error && <div className="error-message">{error}</div>}

      <div className="search-section">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="users-table-section">
        <h2>All Users ({filteredUsers.length})</h2>
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Reports Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((userItem) => (
                  <tr key={userItem._id}>
                    <td>{userItem.name}</td>
                    <td>{userItem.email}</td>
                    <td>{userItem.reportCount}</td>
                    <td>
                      <Link
                        to={`/admin/users/${userItem._id}/reports`}
                        className="action-link"
                      >
                        View Reports
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
