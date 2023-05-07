const Router = require('express');
const router = new Router();
const ratingController = require('../controllers/ratingController');

// для получения рейтинга конкретного пользователя и определенного произведения
router.get('/user/:userId/item/:itemId',);

// для создания или обновления рейтинга
router.post('/', ratingController.create);

module.exports = router;