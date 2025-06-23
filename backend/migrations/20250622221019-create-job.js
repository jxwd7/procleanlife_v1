'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      title: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('open', 'assigned', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'open'
      },
      basePrice: {
        type: Sequelize.DECIMAL
      },
      recurrence: {
        type: Sequelize.ENUM('once', 'weekly', 'bi-weekly', 'monthly'),
        defaultValue: 'once'
      },
      scheduledAt: {
        type: Sequelize.DATE
      },
      details: {
        type: Sequelize.JSONB
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Jobs');
  }
};