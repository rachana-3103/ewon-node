const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ewon', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql' // Specify the dialect explicitly
});

// Test the connection
exports.dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};