require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const reportRoutes = require('./routes/report');
const compatibilityRoutes = require('./routes/compatibility');
const userRoutes = require('./routes/user');
const luckyRoutes = require('./routes/lucky');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'NIM backend running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pay', paymentRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/compatibility', compatibilityRoutes);
app.use('/api/user', userRoutes);
app.use('/api/lucky', luckyRoutes);

app.listen(PORT, () => {
  console.log(`NIM backend listening on http://localhost:${PORT}`);
});
