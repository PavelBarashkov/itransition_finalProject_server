const {Review, Tag, Type, Comment, Image} = require('../models/models');
const ApiError = require('../error/ApiError');


class ReviewController{

    async getAll(req, res, next) {
        try {
            let { typeId, tagId, limit, page } = req.query;
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit;  
            let tagName = tagId ? tagId : [];

            let review;
            if(!typeId && !tagId) {
                review = await Review.findAndCountAll({limit, offset});
            }
            if(typeId && !tagId) {
                review = await Review.findAndCountAll(
                    {
                        include: [
                            {
                                model: Type,
                                where: {id: typeId},
                                attributes: ["name"],
                                through: {attributes: []},  
                            },
                        ], 
                        limit, 
                        offset,
                    }
                );
            }
            if(!typeId && tagId) {
                review = await Review.findAndCountAll(
                    {
                        include: [
                            {
                                model: Tag,
                                where: {id: tagName},
                                attributes: ['name'],
                                through: {attributes: []},  
                            }
                        ],
                        limit, 
                        offset,
                    }, 
                )
            }
            if(typeId && tagId) {
                review = await Review.findAndCountAll(
                    {
                        include: [
                            {
                                model: Type,
                                where: {id: typeId},
                                attributes: ["name"],
                                through: {attributes: []},  
                            },
                            {
                                model:Tag,
                                where: {id: tagName},
                                attributes: ['name'],
                                through: {attributes: []},  
                            }
                        ],
                        limit, 
                        offset,
                    },
                    
                )
            }
            return res.json(review);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async create(req, res, next) {
        try {
            const { title, name, body, rating, userId, tag } = req.body;
            const { image, type} = req.query;
            const review = await Review.create({ title, name,  body, rating, userId });
          
            const typeRewiew = await Type.findByPk(type);
            await review.addType(typeRewiew);

            const imageRewiew = await Image.findByPk(image);
            await review.addImage(imageRewiew);

            const tagPromises = tag.map(tagName => {
                return Tag.findOrCreate({ where: { name: tagName } });
            });
            const tagInstances = await Promise.all(tagPromises);
            const tagIds = tagInstances.map(tag => tag[0].id);
            await review.addTags(tagIds);
          
            return res.json(review);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
      }
      
    async getId(req, res, next) {
        const {id} = req.params
        try {
            const review = await Review.findOne(
                {
                    where: {id},
                    include: [
                        {
                            model: Image,
                            attributes: ['pathToCloudStorage'],
                            through: {attributes: []},
                        }, 
                        {
                            model: Type,
                            attributes: ['name'],
                            through: {attributes: []},

                        }, 
                        {
                            model: Tag,
                            attributes: ['name'],
                            through: {attributes: []},
                        }, 
                        {
                            model: Comment,
                            attributes: ['userId', "createComment", "body"],
                        }
                    ],
                
                },
            )
            return res.json(review);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
        
    }   

    async delete(req, res) {
    }    

    async search(req, res) {
    }
}

module.exports = new ReviewController();