const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection]', reason);
});

const startServer = async () => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MailMind Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  try {
    await connectDB();
  } catch (err) {
    console.warn('[Warning] DB connection warning:', err.message);
  }
};

startServer();
