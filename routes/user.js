const express = require('express');
const router = express.Router();
const { getReports } = require('../utils/memoryStore');

// GET /api/user/reports/:identifier
router.get('/reports/:identifier', (req, res) => {
  const { identifier } = req.params;
  if (!identifier) {
    return res.status(400).json({ error: 'identifier required' });
  }

  const reports = getReports(identifier);
  res.json({ identifier, reports });
});

module.exports = router;
