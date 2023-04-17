const {Comment} = require('../models/models');
const ApiError = require('../error/ApiError');

class CommentController {
    
    async create(req, res) {
        try {
            const date = new Date();
            const comment = await Comment.create({
                userId: req.body.userId,
                reviewId: req.body.reviewId,
                body: req.body.body,
                createComment: date.toLocaleString(),
            });
            res.json({comment});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    
    async getAll(req, res) {
        const comments = await Comment.findAll();
        return res.json(comments)
    }

    async getId(req, res) {
        const {id} = req.params;
        try {
            const comment = await Comment.findOne({where: {id}});
            return res.json(comment)
        } catch(e) {
            next(ApiError.badRequest(e.message));

        }
    }
}

module.exports = new CommentController();