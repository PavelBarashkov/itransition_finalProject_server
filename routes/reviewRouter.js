const Router = require('express');
const router = new Router();
const reviewController = require('../controllers/reviewController');

// для отображения списка всех обзоров
router.get('/reviews', reviewController.getAll);

// для создания нового обзора
router.post('/create', reviewController.create);

// для отображения страницы отдельного обзора
router.get('/:id', reviewController.getId);

// для удаления обзора 
router.get('/:id/delete',);

// для поиска обзоров
router.get('/search',);


module.exports = router;