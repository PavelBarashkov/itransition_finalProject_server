const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../milddleware/AuthMiddleware');
const checkRole = require('../milddleware/checkRoleMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);
router.get('/', checkRole('ADMIN'), userController.getAll);
router.get('/:id', userController.getUserId);


module.exports = router; 