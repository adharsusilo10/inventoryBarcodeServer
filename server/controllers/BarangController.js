const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const QRCode = require('qrcode');
const {
    barang
} = require('../models');
const { Op } = require("sequelize");

class BarangController {
    static async listBarang(req, res, next) {
        try {
            const { search } = req.query;
            const where = {};
            if (search) {
                Object.assign({
                    nama: {
                        [Op.like]: `%${search}%`,
                    },
                });
            }
            const barangData = await barang.findAll({
                where: where,
            });
            res.status(StatusCodes.OK).json(barangData);
        } catch (err) {
            next(err);
        }
    }
    static async getOneBarang(req, res, next) {
        try {
            const { barangId } = req.params;
            const barangData = await barang.findOne({
                where: {
                    id: barangId,
                }
            });
            if (!barangData) throw createHttpError(StatusCodes.NOT_FOUND, 'barang tidak ditemukan');
            res.status(StatusCodes.OK).json(barangData);
        } catch (err) {
            next(err);
        }
    }
    static async masukBarang(req, res, next) {
        try {
            if (req.UserData.role === 'direktur') throw createHttpError(StatusCodes.UNAUTHORIZED, 'invalid role');
            const { barangId } = req.params;
            const barangData = await barang.findOne({
                where: {
                    id: barangId,
                }
            });
            if (!barangData) throw createHttpError(StatusCodes.NOT_FOUND, 'barang tidak ditemukan');
            await barang.update({
                jumlah_masuk: Number(barangData.jumlah_masuk) + 1,
                total: Number(barangData.total) + 1, 
            }, {
                where: {
                    id: barangId,
                }
            })
            res.status(StatusCodes.OK).json({ msg: 'Success' });
        } catch (err) {
            next(err);
        }
    }
    static async keluarBarang(req, res, next) {
        try {
            if (req.UserData.role === 'direktur') throw createHttpError(StatusCodes.UNAUTHORIZED, 'invalid role');
            const { barangId } = req.params;
            const barangData = await barang.findOne({
                where: {
                    id: barangId,
                }
            });
            if (!barangData) throw createHttpError(StatusCodes.NOT_FOUND, 'barang tidak ditemukan');
            await barang.update({
                jumlah_keluar: Number(barangData.jumlah_keluar) + 1,
                total: Number(barangData.total) - 1, 
            }, {
                where: {
                    id: barangId,
                }
            })
            res.status(StatusCodes.OK).json({ msg: 'Success' });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = BarangController;
