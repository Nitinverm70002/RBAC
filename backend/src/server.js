require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(rateLimit({ windowMs: 60*1000, max: 200 }));

// Simple correlation id logger
app.use((req, res, next) => {
  req.correlationId = require('uuid').v4();
  res.setHeader('X-Correlation-Id', req.correlationId);
  next();
});

app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/admin', adminRoutes);

const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/rbacdb';
mongoose.connect(mongoUri).then(() => {
  logger.info('Connected to MongoDB');
  app.listen(port, ()=> logger.info(`Server running on ${port}`));
}).catch(err => {
  logger.error('Mongo connection error', err);
});
