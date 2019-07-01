'use strict';

module.exports = (sequelize, DataTypes) => {
  var Transaction = sequelize.define('Transaction', {
    transactionHash: {
      type: DataTypes.STRING,
      unique: true
    },
    blockHash: DataTypes.STRING,
    blockNumber: DataTypes.BIGINT,
    eventName: DataTypes.STRING,
    returnValues: DataTypes.TEXT
  });

  return Transaction;
};