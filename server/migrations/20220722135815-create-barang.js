'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('barangs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      ukuran: {
        type: Sequelize.STRING
      },
      jumlah_masuk: {
        type: Sequelize.INTEGER
      },
      jumlah_keluar: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.INTEGER
      },
      harga: {
        type: Sequelize.STRING
      },
      qr_code: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('barangs');
  }
};