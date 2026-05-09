import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeResume } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !role) {
      setError('Please upload a PDF file and enter a job role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('roleName', role);

      const response = await analyzeResume(formData);
      setResult(response.data.report);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>SkillSync AI - Dashboard</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/history')} className="btn-secondary">
            View History
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="upload-card">
          <h2>Analyze Your Resume</h2>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Upload Resume (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
              {file && <p className="file-selected">✓ {file.name}</p>}
            </div>

            <div className="form-group">
              <label>Enter Job Role (e.g., "Data Scientist", "DevOps Engineer")</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter any job role you're applying for..."
                required
              />
              <small>You can enter any role you want to analyze against</small>
            </div>

            <button type="submit" disabled={loading} className="btn-analyze">
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </form>
        </div>

        {result && (
          <div className="result-card">
            <h2>Analysis Results</h2>

            <div className="score-display">
              <div className="score-circle">
                <span className="score-value">{result.score}</span>
                <span className="score-label">%</span>
              </div>
            </div>

            <div className="result-section">
              <h3>Skills Found</h3>
              <div className="tags-container">
                {result.skillsFound.length > 0 ? (
                  result.skillsFound.map((skill, idx) => (
                    <span key={idx} className="tag tag-success">
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">No skills detected</p>
                )}
              </div>
            </div>

            <div className="result-section">
              <h3>Missing Skills</h3>
              <div className="tags-container">
                {result.missingSkills.length > 0 ? (
                  result.missingSkills.map((skill, idx) => (
                    <span key={idx} className="tag tag-danger">
                      ✗ {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">All required skills found!</p>
                )}
              </div>
            </div>

            <div className="result-section">
              <h3>Feedback</h3>
              <p className="feedback-text">{result.feedback}</p>
            </div>

            <div className="result-section">
              <h3>Suggestions</h3>
              <ul className="suggestions-list">
                {result.suggestions.length > 0 ? (
                  result.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))
                ) : (
                  <li>No suggestions at this time</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
