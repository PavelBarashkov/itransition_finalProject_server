const Router = require('express');
const router = new Router();
const tagController = require('../controllers/tagController');

// для добавления нового тега 
router.post('/create', tagController.create);

// для получения всех тегов
router.get('/', tagController.getAll);

// для редактирования существующего тега 
router.get('/:id/edit',);

// для удаления тега
router.get('/:id/delete',);

module.exports = router;