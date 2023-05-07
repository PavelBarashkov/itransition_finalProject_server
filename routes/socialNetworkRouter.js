const Router = require('express');
const router = new Router();
const SocialNetworkController = require('../controllers/socialNetworkController');

router.post('/google', SocialNetworkController.loginGoogle);
router.post('/facebook', SocialNetworkController.loginFacebook);
module.exports = router;