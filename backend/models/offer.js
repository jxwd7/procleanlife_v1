'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Offer.belongsTo(models.User, {
        foreignKey: 'cleanerId',
        as: 'cleaner'
      });
      Offer.belongsTo(models.Job, {
        foreignKey: 'jobId',
        as: 'job'
      });
      Offer.hasOne(models.Payment, {
        foreignKey: 'offerId',
        as: 'payment'
      });
    }
  }
  Offer.init({
    jobId: DataTypes.INTEGER,
    cleanerId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Offer',
  });
  return Offer;
};