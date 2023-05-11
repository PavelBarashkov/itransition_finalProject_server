const {Review, Tag, Type, Comment, Image, User, Product} = require('../models/models');
const { Op } = require('sequelize');

class SearchController {
    
    async getReviews(req, res) {
        const query = req.query.query.toLowerCase();
      
        const reviews = await Review.findAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.iRegexp]: `(${query.split(' ').join('|')})`
                        }
                    },
                    {
                        body: {
                            [Op.iRegexp]: `(${query.split(' ').join('|')})`
                        }
                    },
                    {
                        '$comments.body$': {
                            [Op.iRegexp]: `(${query.split(' ').join('|')})`
                        }
                    },
                    {
                        '$products.name$': {
                        [Op.iRegexp]: `(${query.split(' ').join('|')})`
                        }
                    }
                ]
              },
              include: [
                {
                  model: User,
                  attributes: ['name']
                },
                {
                  model: Product,
                  attributes: ['name']
                },
                {
                  model: Type,
                  attributes: ['name']
                },
                {
                  model: Tag,
                  attributes: ['name']
                },
                {
                    model: Image,
                    attributes: ['pathToCloudStorage'],
                    through: {attributes: []},
                },
                {
                  model: Comment,
                  attributes: ['body', 'createComment'],
               
                }
              ]
            });
      
        return res.json(reviews);
      }
  
}

module.exports = new SearchController();

