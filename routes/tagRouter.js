const Router = require('express');
const router = new Router();
const tagController = require('../controllers/tagController');
const checkRole = require('../milddleware/checkRoleMiddleware');


// для добавления нового тега 
router.post('/create', checkRole('ADMIN'), tagController.create);

// для получения всех тегов
router.get('/', tagController.getAll);

// для редактирования существующего тега 
router.get('/:id/edit',);

// для удаления тега
router.get('/:id/delete',);

module.exports = router;