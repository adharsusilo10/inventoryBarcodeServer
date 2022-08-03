'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class barang extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			barang.hasMany(models.barang_confirm, { foreignKey: 'barang_id' });
		}
	}
	barang.init(
		{
			nama: DataTypes.STRING,
			ukuran: DataTypes.STRING,
			jumlah_masuk: DataTypes.INTEGER,
			jumlah_keluar: DataTypes.INTEGER,
			total: DataTypes.INTEGER,
			harga: DataTypes.STRING,
			qr_code: DataTypes.TEXT,
			image_path: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'barang',
		}
	);
	return barang;
};
