const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mailmind';
    
    // Fast 1.5s selection timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`[MongoDB] Connected to live MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Primary connection unavailable (${error.message}). Initializing In-Memory Mongo Server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'mailmind',
        },
      });
      const inMemoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected to In-Memory Dev MongoDB: ${inMemoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB Warning] In-Memory Mongo Server unavailable: ${memErr.message}. Operating in fallback dev mode.`);
      return null;
    }
  }
};

module.exports = connectDB;
