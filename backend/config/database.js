const { Sequelize } = require('sequelize');
const path = require('path');

// Define the database file path
let dbPath;

// For Render deployment
if (process.env.NODE_ENV === 'production' && process.env.RENDER) {
  dbPath = path.join('/opt/render/project/src/data', 'database.sqlite');
} else if (process.env.NODE_ENV === 'test') {
  // For testing
  dbPath = path.join(__dirname, '..', 'database_test.sqlite');
} else {
  // For development
  dbPath = path.join(__dirname, '..', 'database.sqlite');
}

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection
}; 