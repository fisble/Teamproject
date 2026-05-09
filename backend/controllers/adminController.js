const User = require('../models/User');
const Report = require('../models/Report');

// Get all users with their report count
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    
    // Get report count for each user
    const usersWithReportCount = await Promise.all(
      users.map(async (user) => {
        const reportCount = await Report.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          reportCount,
        };
      })
    );

    res.status(200).json({
      message: 'Users retrieved successfully',
      users: usersWithReportCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reports with user information
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: 'userId',
        select: 'name email',
        match: { role: 'user' },
      })
      .sort({ createdAt: -1 });

    // Filter out reports where user was not found
    const validReports = reports.filter((report) => report.userId !== null);

    res.status(200).json({
      message: 'All reports retrieved successfully',
      totalReports: validReports.length,
      reports: validReports,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reports for a specific user
exports.getUserReports = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reports = await Report.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'User reports retrieved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      reports,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalReports = await Report.countDocuments();
    
    // Get average score
    const avgScoreResult = await Report.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
        },
      },
    ]);

    const averageScore = avgScoreResult[0]?.averageScore || 0;

    // Get recent reports
    const recentReports = await Report.find()
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      message: 'Dashboard stats retrieved successfully',
      stats: {
        totalUsers,
        totalReports,
        averageScore: parseFloat(averageScore.toFixed(2)),
      },
      recentReports,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    const users = await User.find({
      role: 'user',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('-password');

    const usersWithReportCount = await Promise.all(
      users.map(async (user) => {
        const reportCount = await Report.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          reportCount,
        };
      })
    );

    res.status(200).json({
      message: 'Search completed successfully',
      users: usersWithReportCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
