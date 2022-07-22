const router = require('express').Router();
const user = require('./user');
const barang = require('./barang');

router.use('/users', user);
router.use('/barang', barang);

module.exports = router;