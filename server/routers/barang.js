const router = require('express').Router();
const BarangController = require('../controllers/BarangController');
const authentication = require('../middlewares/authentication');

router.get('/list', BarangController.listBarang );
router.get('/single/:barangId', BarangController.getOneBarang);
router.put('/masuk/:barangId', authentication, BarangController.masukBarang);
router.put('/keluar/:barangId', authentication, BarangController.keluarBarang);
router.get('/direktur/list', authentication, BarangController.listToConfirm);
router.put('/direktur/confirm', authentication, BarangController.confirmBarang);
router.get('/laporan/list', authentication, BarangController.listLaporan);

module.exports = router;
