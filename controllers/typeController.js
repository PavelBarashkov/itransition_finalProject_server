const {Type} = require('../models/models');
const ApiError = require('../error/ApiError');

class TypeController {

    async create(req, res) {
        const {name} = req.body;
        const tag = await Type.create({name});
        return res.json(tag)
    } 

    async getAll(req, res) {
        const type = await Type.findAll();
        return res.json(type)
    } 
    
    async edit(req, res) {

    }
    
   

    async delete(req, res) {
        
    }

}

module.exports = new TypeController();