const Role = require('../models/Role');
const Report = require('../models/Report');
const { extractTextFromPDF } = require('../utils/pdfParser');
const { analyzeResumeWithAI } = require('../utils/groqAPI');

// Analyze resume
exports.analyzeResume = async (req, res) => {
  try {
    const { roleName } = req.body;
    const userId = req.user.id;

    // Validation
    if (!roleName) {
      return res.status(400).json({ message: 'Please provide a role name' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Please upload a valid PDF file' });
    }

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(req.file.buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'No text found in resume' });
    }

    // Analyze with AI - pass role name, AI determines required skills
    const analysisResult = await analyzeResumeWithAI(resumeText, roleName, []);

    // Save report to database
    const report = await Report.create({
      userId,
      role: roleName,
      skillsFound: analysisResult.skillsFound,
      missingSkills: analysisResult.missingSkills,
      score: analysisResult.score,
      feedback: analysisResult.feedback,
      suggestions: analysisResult.suggestions,
    });

    res.status(200).json({
      message: 'Analysis completed successfully',
      report,
    });
  } catch (error) {
    console.error('Error in analyzeResume:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's history
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const reports = await Report.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'History retrieved successfully',
      reports,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
