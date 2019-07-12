'use strict';
module.exports = (sequelize, DataTypes) => {
  const RegistryEntity = sequelize.define('RegistryEntity', {
    _id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    documents_url: DataTypes.STRING,
    image_url: DataTypes.STRING,
    points: DataTypes.STRING,
    _created_at: DataTypes.INTEGER
  }, {});
  RegistryEntity.associate = function(models) {
    // associations can be defined here
  };
  return RegistryEntity;
};