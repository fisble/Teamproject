const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Role = require('./models/Role');
const Report = require('./models/Report');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Pre-load roles
const initializeRoles = async () => {
  try {
    const rolesCount = await Role.countDocuments();
    if (rolesCount === 0) {
      await Role.insertMany([
        {
          roleName: 'Fullstack Developer',
          requiredSkills: ['html', 'css', 'javascript', 'react', 'node', 'mongodb'],
        },
        {
          roleName: 'Software Engineer',
          requiredSkills: ['java', 'python', 'dsa', 'sql'],
        },
        {
          roleName: 'AI Engineer',
          requiredSkills: ['python', 'machine learning', 'deep learning', 'nlp', 'tensorflow'],
        },
      ]);
      console.log('✓ Default roles initialized');
    }
  } catch (error) {
    console.error('Error initializing roles:', error.message);
  }
};

// Routes
const authRoutes = require('./routes/authRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', analyzeRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'SkillSync AI Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await initializeRoles();
  console.log(`✓ Server running on port ${PORT}`);
});

module.exports = app;
