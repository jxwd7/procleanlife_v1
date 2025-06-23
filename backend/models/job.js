'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Job.belongsTo(models.User, {
        foreignKey: 'customerId',
        as: 'customer'
      });
      Job.hasMany(models.JobPhoto, {
        foreignKey: 'jobId',
        as: 'photos'
      });
      Job.hasMany(models.Offer, {
        foreignKey: 'jobId',
        as: 'offers'
      });
      Job.hasMany(models.Message, {
        foreignKey: 'jobId',
        as: 'messages'
      });
      Job.hasMany(models.Payment, {
        foreignKey: 'jobId',
        as: 'payments'
      });
    }
  }
  Job.init({
    customerId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    location: DataTypes.STRING,
    status: DataTypes.STRING,
    basePrice: DataTypes.DECIMAL,
    recurrence: DataTypes.STRING,
    scheduledAt: DataTypes.DATE,
    details: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Job',
  });
  return Job;
};