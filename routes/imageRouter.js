const Router = require('express');
const router = new Router();
const imageController = require('../controllers/imageController');

router.post('/upload', imageController.upload);

module.exports = router;
