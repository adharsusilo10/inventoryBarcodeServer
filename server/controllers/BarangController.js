const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const QRCode = require('qrcode');
const {
    barang,
    barang_confirm,
    user
} = require('../models');
const { Op } = require("sequelize");

class BarangController {
    static async listBarang(req, res, next) {
        try {
            const { search } = req.query;
            const where = {};
            if (search) {
                Object.assign(where, {
                    nama: {
                        [Op.iLike]: `%${search}%`,
                    },
                });
            }
            const barangData = await barang.findAll({
                where: where,
                order: [['nama', 'ASC']],
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
            await barang_confirm.create({
                user_id: req.UserData.id,
                barang_id: barangId,
                type: 'masuk',
                jumlah: 1,
                status: 'unconfirmed'
            });
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
            await barang_confirm.create({
                user_id: req.UserData.id,
                barang_id: barangId,
                type: 'keluar',
                jumlah: 1,
                status: 'unconfirmed'
            });
            res.status(StatusCodes.OK).json({ msg: 'Success' });
        } catch (err) {
            next(err);
        }
    }
    static async listToConfirm(req, res, next) {
        try {
            if (req.UserData.role !== 'direktur') throw createHttpError(StatusCodes.UNAUTHORIZED, 'invalid role');
            const { search } = req.query;
            const where = {};
            if (search) {
                Object.assign(where, {
                    nama: {
                        [Op.iLike]: `%${search}%`,
                    },
                });
            }
            const barangData = await barang.findAll({
                where: where,
                order: [['nama', 'ASC']],
            });
            let dataConfirm = await Promise.all(
                barangData.map(async (barang) => {
                    const confirmList = await barang_confirm.findAll({
                        where: {
                            barang_id: barang.id,
                            status: 'unconfirmed',
                        },
                    });
                    return {
                        dataBarang: barang,
                        dataConfirm: confirmList,
                    };
                }),
            );
            dataConfirm = dataConfirm.filter((barang) => barang.dataConfirm.length !== 0).map((data) => {
                const dataConfirmMasuk = data.dataConfirm.filter((barang) => barang.type === 'masuk');
                const dataConfirmKeluar = data.dataConfirm.filter((barang) => barang.type === 'keluar');
                return {
                    dataBarang: data.dataBarang,
                    dataConfirmMasuk: dataConfirmMasuk,
                    dataConfirmKeluar: dataConfirmKeluar,
                }
            });
            res.status(StatusCodes.OK).json(dataConfirm);
        } catch (err) {
            next(err);
        }
    }
    static async confirmBarang(req, res, next) {
        try {
            if (req.UserData.role !== 'direktur') throw createHttpError(StatusCodes.UNAUTHORIZED, 'invalid role');
            let { isConfirm, barang_id, type } = req.body;
            isConfirm = JSON.parse(isConfirm);
            if (!barang_id || !type) throw createHttpError(StatusCodes.BAD_REQUEST, 'All fields required');
            if (type !== 'masuk' && type !== 'keluar') throw createHttpError(StatusCodes.BAD_REQUEST, 'wrong type');
            const barangData = await barang.findOne({
                where: {
                    id: barang_id,
                },
            });
            if (!barangData) throw createHttpError(StatusCodes.NOT_FOUND, 'barang not found');
            if (isConfirm === true) {
                const confirmData = await barang_confirm.findAll({
                    where: {
                        barang_id: barang_id,
                        type: type,
                        status: 'unconfirmed',
                    }
                });
                if (confirmData.length > 0) {
                    let jumlahProduk = confirmData.length;
                    if (type === 'masuk') {
                        await barang.update({
                            jumlah_masuk: barangData.jumlah_masuk += jumlahProduk,
                            total: barangData.total += jumlahProduk,
                        }, {
                            where: {
                                id: barang_id,
                            },
                        });
                    } else if (type === 'keluar') {
                        await barang.update({
                            jumlah_keluar: barangData.jumlah_keluar += jumlahProduk,
                            total: barangData.total -= jumlahProduk,
                        }, {
                            where: {
                                id: barang_id,
                            },
                        });
                    }
                }
            }
            await barang_confirm.update({
                status: isConfirm === true ? 'approved' : 'rejected'
            }, {
                where: {
                    barang_id: barang_id,
                    type: type,
                    status: 'unconfirmed',
                }
            })
            res.status(StatusCodes.OK).json({ msg: 'Success' });
        } catch (err) {
            next(err);
        }
    }

    static async listLaporan(req, res, next) {
        try {
            if (req.UserData.role !== 'helper' && req.UserData.role !== 'direktur') throw createHttpError(StatusCodes.UNAUTHORIZED, 'invalid role');
            const where = {};
            if (req.UserData.role === 'helper') {
                Object.assign(where, {
                    user_id: req.UserData.id,
                });
            }
            const laporan = await barang_confirm.findAll({
                where: where,
                order: [['createdAt', 'DESC']],
                include: [{
                    model: user,
                    required: true,
                }, {
                    model: barang,
                    required: true,
                }],
            });
            res.status(StatusCodes.OK).json(laporan);
        } catch (err) {
            next(err);
        }
    }
};

module.exports = BarangController;
