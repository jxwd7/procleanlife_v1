'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobPhoto.belongsTo(models.Job, {
        foreignKey: 'jobId',
        as: 'job'
      });
    }
  }
  JobPhoto.init({
    jobId: DataTypes.INTEGER,
    photoUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'JobPhoto',
  });
  return JobPhoto;
};