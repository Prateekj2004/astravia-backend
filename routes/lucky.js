// backend/routes/lucky.js

const express = require('express');
const router = express.Router();
const generateLuckyProfile = require('../nim/luckyEngine');

// POST /api/lucky/generate
// body: { name, dob }
router.post('/generate', (req, res) => {
  try {
    const { name, dob } = req.body;
    if (!name || !dob) {
      return res.status(400).json({ error: 'name and dob required' });
    }

    const luckyProfile = generateLuckyProfile(name, dob);
    res.json(luckyProfile);
  } catch (err) {
    console.error('Error in lucky generate:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
