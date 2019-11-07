'use strict';
module.exports = (sequelize, DataTypes) => {
  const RegistryEntity = sequelize.define('RegistryEntity', {
    _id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    documents_url: DataTypes.STRING,
    image_url: DataTypes.STRING,
    priceUSD: DataTypes.STRING,
    points: DataTypes.TEXT,
    _created_at: DataTypes.INTEGER,
    creator_addr: DataTypes.STRING
  }, {});
  RegistryEntity.associate = function(models) {
    // associations can be defined here
  };
  return RegistryEntity;
};