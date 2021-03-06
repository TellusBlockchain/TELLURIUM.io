'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    transactionHash: DataTypes.STRING,
    blockHash: DataTypes.STRING,
    eventName: DataTypes.STRING,
    blockNumber: DataTypes.BIGINT,
    returnValues: DataTypes.TEXT
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};