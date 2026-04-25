const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { router: otpRoutes } = require('./routes/otp');
const { ensureSampleDoctors } = require('./utils/sampleDoctors');
const { ensureAdminUser } = require('./utils/seedAdmin');

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const recordRoutes = require('./routes/records');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/otp', otpRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

// Serve React frontend
app.use(express.static(path.join(__dirname, '../client/build')));

// Root test route (optional)
app.get('/api', (req, res) => {
  res.send('AI Healthcare System Backend Running');
});

// React catch-all route (IMPORTANT)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
async function startServer() {
  try {
    await connectDB();
    await ensureAdminUser();
    await ensureSampleDoctors();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Server startup error:', err.message);
    process.exit(1);
  }
}

startServer();