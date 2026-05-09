const express = require('express');
const multer = require('multer');
const { analyzeResume, getHistory } = require('../controllers/analyzeController');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

router.post('/analyze', auth, upload.single('resume'), analyzeResume);
router.get('/history', auth, getHistory);

module.exports = router;
