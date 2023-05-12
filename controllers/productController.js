const {Product} = require('../models/models');
const ApiError = require('../error/ApiError');

class ProductController {

    async create(req, res, next) {
        const {name} = req.body;

        const productName = await Product.findOne({where: {name}});
        if(productName) {
            return next(ApiError.badRequest('Произведение с таким названием уже существует'));
        }
        const product = await Product.create({name});
        return res.json(product)
    } 

    async getAll(req, res ) {
        const product = await Product.findAll();
        return res.json(product)
    } 
    
    async edit(req, res) {

    }
    
   

    async delete(req, res) {
        
    }

}

module.exports = new ProductController();