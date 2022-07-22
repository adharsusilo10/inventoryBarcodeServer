'use strict';

const QRCode = require('qrcode')

module.exports = {
  up: async(queryInterface, Sequelize) => {
    const satu = await QRCode.toDataURL('1');
    const dua = await QRCode.toDataURL('2');
    const tiga = await QRCode.toDataURL('3');
    await queryInterface.bulkInsert('barangs', [{
      id: 1,
      nama: 'Plug',
      ukuran: '50 ml',
      jumlah_masuk: 40000,
      jumlah_keluar: 0,
      total: 40000,
      harga: 'IDR 250.000',
      qr_code: satu,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      nama: 'Pot Lulur',
      ukuran: '50 g',
      jumlah_masuk: 70000,
      jumlah_keluar: 0,
      total: 70000,
      harga: 'IDR 1.400',
      qr_code: dua,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      nama: 'Prefrom',
      ukuran: '10 g',
      jumlah_masuk: 100000,
      jumlah_keluar: 0,
      total: 100000,
      harga: 'IDR 1.000',
      qr_code: tiga,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('barangs', null, {});
  }
};