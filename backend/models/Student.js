const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rollNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  classId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.STRING,
  },
  parentContact: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
  },
  gender: {
    type: DataTypes.STRING,
    validate: {
      isIn: [['Male', 'Female', 'Other']]
    }
  },
  profilePictureUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
  },
}, {
  // Add timestamps (createdAt, updatedAt)
  timestamps: true,
});

// Add instance method for fullName
Student.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = Student; 