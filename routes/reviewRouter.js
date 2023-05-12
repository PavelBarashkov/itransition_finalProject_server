const Router = require('express');
const router = new Router();
const reviewController = require('../controllers/reviewController');

// для отображения списка всех обзоров
router.get('/reviews', reviewController.getAll);

// для создания нового обзора
router.post('/create', reviewController.create);

// для отображения страницы отдельного обзора
router.get('/:id', reviewController.getId);

// для получения всех обзоров для определенного пользователя
router.get('/user/:id', reviewController.getUserId);

// для удаления обзора 
router.get('/delete/:id', reviewController.deleteReview);

// для поиска обзоров
router.get('/search',);

router.put('/update/:id', reviewController.updateReview);


router.post('/review/:id/like', reviewController.likeReview)

router.get('/product/:id', reviewController.getReviewforProductn)

module.exports = router;