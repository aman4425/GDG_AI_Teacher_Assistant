const { sequelize } = require('../config/database');
const Faculty = require('./Faculty');
const Student = require('./Student');
const Course = require('./Course');

// Define associations between models
Faculty.hasMany(Course, {
  foreignKey: 'facultyId',
  as: 'courses'
});

Course.belongsTo(Faculty, {
  foreignKey: 'facultyId',
  as: 'faculty'
});

// Export models
module.exports = {
  sequelize,
  Faculty,
  Student,
  Course
}; 