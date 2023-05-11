const Router = require('express');
const router = new Router();
const searchController = require('../controllers/searchController');


// Определите маршрут для полнотекстового поиска
router.get('/search', searchController.getReviews);

module.exports = router;