'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Offer, {
        foreignKey: 'cleanerId',
        as: 'offers'
      });
      User.hasMany(models.Message, {
        foreignKey: 'senderId',
        as: 'sentMessages'
      });
      User.hasMany(models.Message, {
        foreignKey: 'receiverId',
        as: 'receivedMessages'
      });
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    role: DataTypes.STRING,
    phone: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};