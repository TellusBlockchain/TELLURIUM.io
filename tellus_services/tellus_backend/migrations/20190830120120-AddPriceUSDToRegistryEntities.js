'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
        return Promise.all([
            queryInterface.addColumn('RegistryEntities', 'priceUSD', {
                type: Sequelize.STRING
            }, { transaction: t })
        ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
        return Promise.all([
            queryInterface.removeColumn('RegistryEntities', 'priceUSD', { transaction: t })
        ])
    })
  }
};
