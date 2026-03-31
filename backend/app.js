require('dotenv').config();
const cors = require("cors")
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const featureRoutes = require('./routes/featureRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.CORS_ORIGIN_URL?.split(",").map((o) => o.trim()) || [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, postman)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(null, true);
      }
    },
    credentials: true,
  }),
);

// Routes
app.use('/api/features', featureRoutes);

// DB connection
mongoose.connect(process.env.MONGODB_URI)  // <-- just this, no options
  .then(() => console.log('infringment DB connected ✅'))
  .catch(err => console.log('DB connection error:', err));

  
// --- Error Handling (optional) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;