'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
      });
      Message.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver'
      });
      Message.belongsTo(models.Job, {
        foreignKey: 'jobId',
        as: 'job'
      });
    }
  }
  Message.init({
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    jobId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};