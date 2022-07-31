'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class barang_confirm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  barang_confirm.init({
    user_id: DataTypes.INTEGER,
    barang_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'barang_confirm',
  });
  return barang_confirm;
};