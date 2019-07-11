'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transactionHash: {
        type: Sequelize.STRING,
        unique: true
      },
      blockHash: {
        type: Sequelize.STRING
      },
      eventName: {
        type: Sequelize.STRING
      },
      blockNumber: {
        type: Sequelize.BIGINT
      },
      returnValues: {
        type: Sequelize.TEXT
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Transactions');
  }
};