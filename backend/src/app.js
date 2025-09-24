const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const nurseRoutes = require('./routes/nurseRoutes');
const staffRoutes = require('./routes/staffRoutes');
const accountRoutes = require('./routes/accountRoutes');
const privacyRoutes = require('./routes/privacyRoutes');
const errorHandler = require('./middleware/errorHandler');
const { handleCsrfErrors } = require('./middleware/csrf');
const { sanitizeValue } = require('./utils/sanitizer');

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.csrfSecret));

app.use((req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  return next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/doctor', doctorRoutes);
app.use('/nurse', nurseRoutes);
app.use('/staff', staffRoutes);
app.use('/account', accountRoutes);
app.use('/info', privacyRoutes);

app.use(handleCsrfErrors);
app.use(errorHandler);

module.exports = app;
