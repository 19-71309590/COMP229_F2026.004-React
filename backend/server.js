const connectDatabase = require('./config/database');
const referenceRoutes = require('./routes/referenceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio backend server is running.'
  });
});

// API routes
app.use('/api/references', referenceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// Handles routes that do not exist
app.use((req, res, next) => {
  next(createError(404, 'Route not found.'));
});

// Global error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error.'
  });
});

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();