import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserReports from './pages/AdminUserReports';
import AdminReports from './pages/AdminReports';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Handle storage change from other tabs/windows
    const handleStorageChange = (e) => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check on component mount
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Logout handler - notify App of logout
  useEffect(() => {
    const checkAuth = setInterval(() => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    }, 500);

    return () => clearInterval(checkAuth);
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin/dashboard" />} />
          <Route path="/admin/register" element={!isAuthenticated ? <AdminRegister /> : <Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/users" element={isAuthenticated ? <AdminUsers /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/users/:userId/reports" element={isAuthenticated ? <AdminUserReports /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/reports" element={isAuthenticated ? <AdminReports /> : <Navigate to="/admin/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
