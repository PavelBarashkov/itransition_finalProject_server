const Router = require('express');
const router = new Router();
const userRouter = require('../controllers/userController');
const authMiddleware = require('../milddleware/AuthMiddleware');

router.post('/registration', userRouter.registration);
router.post('/login', userRouter.login);
router.get('/auth', authMiddleware, userRouter.check);
router.get('/', userRouter.getAll);

module.exports = router; 