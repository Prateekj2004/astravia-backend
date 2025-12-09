const express = require('express');
const router = express.Router();
const generateCompatibility = require('../nim/compatibilityEngine');

// POST /api/compatibility/check
// body: { personA: { name, dob }, personB: { name, dob } }
router.post('/check', (req, res) => {
  try {
    const { personA, personB } = req.body;
    if (!personA || !personB || !personA.name || !personA.dob || !personB.name || !personB.dob) {
      return res.status(400).json({ error: 'personA and personB details required' });
    }

    const result = generateCompatibility(personA, personB);
    res.json(result);
  } catch (err) {
    console.error('Error in compatibility:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
