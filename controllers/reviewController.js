const {Review, Tag, Type, Comment, Image, Rating, Like, User, Product} = require('../models/models');
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
                review = await Review.findAndCountAll(
                    {
                        include: [
                            {
                                model: Type,
                                attributes: ["name"],
                                through: {attributes: []},  
                            },
                            {
                                model: Product,
                                attributes: ['name', 'id', 'averageRating'],
                                through: {attributes: []},
    
                            },
                            {
                                model: Image,
                                attributes: ['pathToCloudStorage'],
                                through: {attributes: []},
                            },
                            {
                                model: Tag,
                                attributes: ['name'],
                                through: {attributes: []},  
                            },
                        ], 
                        distinct: true, 
                        limit, 
                        offset,
                    }
                )
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
                            {
                                model: Product,
                                attributes: ['name', 'id', 'averageRating'],
                                through: {attributes: []},
    
                            },
                            {
                                model: Image,
                                attributes: ['pathToCloudStorage'],
                                through: {attributes: []},
                            },
                            {
                                model: Tag,
                                attributes: ['name'],
                                through: {attributes: []},  
                            },
                        ], 
                        distinct: true, 
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
                            },
                            {
                                model: Product,
                                attributes: ['name', 'id', 'averageRating'],
                                through: {attributes: []},
    
                            },
                            {
                                model: Image,
                                attributes: ['pathToCloudStorage'],
                                through: {attributes: []},
                            },
                            {
                                model: Type,
                                attributes: ["name"],
                                through: {attributes: []},  
                            },
                        ],
                        distinct: true, 
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
                                model: Product,
                                attributes: ['name', 'id', 'averageRating'],
                                through: {attributes: []},
    
                            },
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
                            },
                            {
                                model: Image,
                                attributes: ['pathToCloudStorage'],
                                through: {attributes: []},
                            },
                        ],
                        distinct: true, 
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
            const { title, product, body, rating, userId, tag, image, type } = req.body;
            const review = await Review.create({ title, body, rating, userId, createReview: new Date().toLocaleString()});


            const productReview = await Product.findOrCreate({ where: { name: product }});
            await review.addProduct(productReview[0]);
          
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
            next(ApiError.badRequest('en: Incorrect fields/ ru: Некорректные поля'));
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
                            attributes: ['pathToCloudStorage', 'id'],
                            through: {attributes: []},
                        }, 
                        {
                            model: Product,
                            attributes: ['name', 'id', 'averageRating'],
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
                        },

                    ],
                
                },
            )
            return res.json(review);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
        
    }   

    async search(req, res) {
    }

    async getUserId(req, res, next) {
        try {
            const { id: userId } = req.params;
            const reviews = await Review.findAll({
                where: {userId: userId},
                    include: [
                        {
                            model: Image,
                            attributes: ['pathToCloudStorage', 'id'],
                            through: {attributes: []},
                        }, 
                        {
                            model: Product,
                            attributes: ['name', 'id'],
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
                        },

                    ],
            });
            return res.json({reviews})
        } catch (e) {
            return next(ApiError.badRequest('У вас нет обзоров'))
        }
    }

    async deleteReview(req, res, next) {
        try {
            const review = await Review.findByPk(req.params.id);
            await review.destroy()
            return res.json({message: 'Review delete'})
        } catch(e) {    
            return next(ApiError.badRequest('Ошибка'))
        }
    }       

    async updateReview(req, res, next) {
        try {
            const { title, name, body, rating, tag, type , imageId} = req.body;
            const review = await Review.findByPk(req.params.id);
            if (!review) {
              return next(ApiError.notFound('Review not found'));
            }
            review.title = title;
            review.name = name;
            review.body = body;
            review.rating = rating;
            await review.save();
        
            const imageInstances = await Image.findAll({where: {id: imageId}});
            await review.setImages(imageInstances);

            const typeInstances = await Type.findAll({ where: { name: type } });
            await review.setTypes(typeInstances);
              
            const tagPromises = tag.map(tagName => {
              return Tag.findOrCreate({ where: { name: tagName } });
            });
            const tagInstances = await Promise.all(tagPromises);
            const tagIds = tagInstances.map(tag => tag[0].id);
            await review.setTags(tagIds);
        
            return res.json(review);
          } catch (e) {
            next(ApiError.badRequest(e.message));
          }
    }


    async likeReview(req, res, next) {
        const reviewId = req.params.id;
        const userId = req.body.userId;
        const like = await Like.findOne({
            where: {
                userId,
                reviewId,
            },
        });
        if (like) {
            return res.status(400).send('You have already liked this review');
        }
        await Like.create({
            userId,
            reviewId,
        });
        const review = await Review.findByPk(reviewId);
        await review.increment('likeCount');
        await review.save();
    
        const user = await User.findByPk(review.userId);
        await user.increment('likeCount');
        await user.save();
    
        res.send('Review liked');
    }
    
}

module.exports = new ReviewController();