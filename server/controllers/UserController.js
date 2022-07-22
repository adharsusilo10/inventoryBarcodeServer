const {
	user
} = require('../models');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class UserController {
	static async loginUser(req, res, next) {
		try {
			const { username, password } = req.body;
			if (!username || !password) throw createError(StatusCodes.BAD_REQUEST, "Wrong Username / Password");
			const userValidation = await user.findOne({ where: { username } });
			if (!userValidation) throw createError(StatusCodes.BAD_REQUEST, "Wrong Username / Password");
			if (!comparePassword(password, userValidation.password)) throw createError(StatusCodes.BAD_REQUEST, "Wrong Username / Password");
			let result = {
				access_token: generateToken({ id: userValidation.id, role: userValidation.role }),
				user_data: userValidation,
			};
			res.status(StatusCodes.OK).json(result);
		} catch (err) {
			next(err);
		}
	}
	static async registerUser(req, res, next) {
		try {
			if (req.UserData.role !== 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'must be an admin');
			}
			const { username, nama, role } = req.body;
			if (!username || !nama || !role) throw createError(StatusCodes.BAD_REQUEST, "Fill in all required fields");
			const userValidation = await user.findOne({ where: { username } });
			if (userValidation) throw createError(StatusCodes.BAD_REQUEST, "Username Already Taken");
			if (role === 'admin') throw createError(StatusCodes.BAD_REQUEST, 'Cannot make admin');
			if (role !== 'direktur' && role !== 'helper') throw createError(StatusCodes.BAD_REQUEST, 'role invalid');
			await user.create({
				nama: nama,
				username: username,
				password: hashPassword('123456'),
				role: 'user',
			});
			res.status(StatusCodes.CREATED).json({ msg: 'Success' });
		} catch (err) {
			next(err);
		}
	}
	static async listUser(req, res, next) {
		try {
			if (req.UserData.role !== 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'must be an admin');
			}
    		const userData = await user.findAll({
				where: {
					role: 'user'
				}
			});
      		res.status(StatusCodes.OK).json({
				data: userData,
			});
		} catch (err) {
			next(err);
		}
	}
	static async deleteUser(req, res, next) {
		try {
			if (req.UserData.role !== 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'must be an admin');
			}
      		const userData = await user.findOne({
				where: {
					id: req.params.id,
				},
			});
			if (!userData) throw createError(StatusCodes.NOT_FOUND, 'user not found');
			if (userData.role === 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'role admin cant be deleted');
			}
			await user.destroy({
				where: {
					id: userData.id,
				},
			});
      		res.status(StatusCodes.OK).json({
				msg: 'Success',
			});
		} catch (err) {
			next(err);
		}
	}
	static async editUser(req, res, next) {
		try {
			const { nama } = req.body;
			if (req.UserData.role !== 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'must be an admin');
			}
      		const userData = await user.findOne({
				where: {
					id: req.params.id,
				},
			});
			if (!userData) throw createError(StatusCodes.NOT_FOUND, 'user not found');
			if (userData.role === 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'role admin cant be edited');
			}
			const updateQuery = {};
			if (nama) Object.assign(updateQuery, { nama: nama });
			await user.update(updateQuery, {
				where: {
					id: req.params.id,
				}
			});
      		res.status(StatusCodes.OK).json({
				msg: 'Success',
			});
		} catch (err) {
			next(err);
		}
	}
	static async changePassword(req, res, next) {
		try {
			const { oldPassword, newPassword } = req.body;
      		const userData = await user.findOne({
				where: {
					id: req.UserData.id,
				},
			});
			if (userData.role === 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'role admin cant be edited');
			}
			if (!comparePassword(oldPassword, userData.password)) throw createError(StatusCodes.BAD_REQUEST, "Wrong Password");
			const updateQuery = {};
			if (newPassword) Object.assign(updateQuery, { password: hashPassword(newPassword) });
			await user.update(updateQuery, {
				where: {
					id: req.UserData.id,
				}
			});
      		res.status(StatusCodes.OK).json({
				msg: 'Success',
			});
		} catch (err) {
			next(err);
		}
	}
	static async resetPassword(req, res, next) {
		try {
      		const userData = await user.findOne({
				where: {
					id: req.UserData.id,
				},
			});
			if (userData.role === 'admin') {
				throw createError(StatusCodes.UNAUTHORIZED, 'role admin cant be edited');
			}
			await user.update({
				password: hashPassword('123456')
			}, {
				where: {
					id: req.UserData.id,
				}
			});
      		res.status(StatusCodes.OK).json({
				msg: 'Success',
			});
		} catch (err) {
			next(err);
		}
	}
};

module.exports = UserController;