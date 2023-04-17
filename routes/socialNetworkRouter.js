const Router = require('express');
const router = new Router();
const SocialNetworkController = require('../controllers/socialNetworkController')

router.post('/google', SocialNetworkController.loginGoogle);

module.exports = router;