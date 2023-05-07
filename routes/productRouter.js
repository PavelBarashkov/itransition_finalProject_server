const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');

// для добавления нового произведения 
router.post('/create', productController.create);

// для получения всех произведений
router.get('/', productController.getAll);


module.exports = router;