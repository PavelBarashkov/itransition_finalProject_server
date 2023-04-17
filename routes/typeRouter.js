const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');
const checkRole = require('../milddleware/checkRoleMiddleware');


// для добавления нового тега 
router.post('/create', checkRole('ADMIN'), typeController.create);

// для получения всех тегов
router.get('/', typeController.getAll);


module.exports = router;