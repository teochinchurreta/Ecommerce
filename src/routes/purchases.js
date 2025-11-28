const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middleware/auth');

router.get('/', auth, purchaseController.list);
router.get('/:id', auth, purchaseController.getOne);
router.post('/', auth, purchaseController.create);
router.put('/:id', auth, purchaseController.update);
router.delete('/:id', auth, purchaseController.remove);

module.exports = router;
