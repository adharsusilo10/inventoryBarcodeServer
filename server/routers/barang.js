const router = require('express').Router();
const BarangController = require('../controllers/BarangController');
const authentication = require('../middlewares/authentication');

router.get('/list', BarangController.listBarang );
router.get('/single/:barangId', BarangController.getOneBarang);
router.put('/masuk/:barangId', authentication, BarangController.masukBarang);
router.put('/keluar/:barangId', authentication, BarangController.keluarBarang);

module.exports = router;
