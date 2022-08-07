'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', "email", {
      type: Sequelize.STRING,
      defaultValue: 'adharsusilo25@gmail.com'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'email');
  }
};