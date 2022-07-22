'use strict';

const { hashPassword } = require('../helpers/bcrypt');

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      nama: 'Admin',
      username: 'admin',
      password: hashPassword('admin123'),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};