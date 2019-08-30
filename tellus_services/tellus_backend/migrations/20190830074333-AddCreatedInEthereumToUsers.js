'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
        return Promise.all([
            queryInterface.addColumn('Users', 'created_in_ethereum', {
                type: Sequelize.BOOLEAN
            }, { transaction: t })
        ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
        return Promise.all([
            queryInterface.removeColumn('Users', 'created_in_ethereum', { transaction: t })
        ])
    })
  }
};
