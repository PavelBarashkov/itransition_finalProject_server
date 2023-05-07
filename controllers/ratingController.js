const ApiError = require('../error/ApiError');
const { Rating, Review, Product } = require('../models/models');

class RatingController {
    
    async getId(req, res) {
        const {id} = req.query;

    }
    
    async create(req, res, next) {
        const {rating, userId, productId} = req.body;
        try {
            const existingRating = await Rating.findOne({ 
                where: { 
                    userId, 
                    productId 
                } 
            });
            if (existingRating) {
                throw new Error('You already rated this review');
            }

            const newRating = await Rating.create({ rating, userId, productId });

            const allRatings = await Rating.findAll({ where: { productId } });

            const sumRatings = allRatings.reduce((acc, rating) => acc + rating.rating, 0);
            const averageRating = sumRatings / allRatings.length;
            const roundedAverageRating = averageRating.toFixed(2);

            await Product.update({ averageRating }, { where: { id: productId } });

            res.json({ averageRating: roundedAverageRating });
        } catch (e){
            return next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new RatingController();