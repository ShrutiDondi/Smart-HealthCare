const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');

const { router: otpRoutes } = require('./routes/otp');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const recordRoutes = require('./routes/records');

const { ensureAdminUser } = require('./utils/seedAdmin');
const { ensureSampleDoctors } = require('./utils/sampleDoctors');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// api routes
app.use('/api/otp', otpRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

// health check
app.get('/api', (req, res) => {
  res.send('AI Healthcare System Backend Running');
});

// frontend
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// ❌ NO app.get('*')
// ❌ NO app.get('/*')

// safe fallback WITHOUT wildcard routes
app.use((req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await ensureAdminUser();
    await ensureSampleDoctors();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();