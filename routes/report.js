const express = require('express');
const router = express.Router();
const generateReport = require('../nim/reportGenerator');

// POST /api/report/generate { name, dob }
router.post('/generate', (req, res) => {
  try {
    const { name, dob } = req.body;
    if (!name || !dob) {
      return res.status(400).json({ error: 'name and dob required' });
    }
    const report = generateReport(name, dob);
    res.json(report);
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
