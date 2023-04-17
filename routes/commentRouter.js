const Router = require('express');
const router = new Router();
const commentController = require('../controllers/commentController');

// Создание нового комментария
router.post('/create', commentController.create);

// Получение списка всех комментариев
router.get('/comments', commentController.getAll);

// Получение информации о конкретном комментарии
router.get('/:id', commentController.getId);

module.exports = router;