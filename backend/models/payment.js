'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Job, {
        foreignKey: 'jobId',
        as: 'job'
      });
      Payment.belongsTo(models.Offer, {
        foreignKey: 'offerId',
        as: 'offer'
      });
    }
  }
  Payment.init({
    jobId: DataTypes.INTEGER,
    offerId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    transactionId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};