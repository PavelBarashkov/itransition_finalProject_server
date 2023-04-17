const ApiError = require('../error/ApiError');
const {User} = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateJwt = function(id, email, role, registrationDate) {
    return jwt.sign(
        {id, email, role, registrationDate}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    
    async registration(req, res, next) {
        const {name, email, password, role} = req.body;
        const date = new Date();

        if(!email && !password) {
            return next(ApiError.badRequest('Некорректный email или пароли'));
        }

        const candidate = await User.findOne({where: {email}});
        if(candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'));
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({name, email, role, password: hashPassword, registrationDate: date.toLocaleString()});
        const token = generateJwt(user.id, user.email, user.role, user.registrationDate);
        return res.json({token});
    }
    
    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});

        if(!user) {
            return next(ApiError.badRequest('Пользователь с таким emal не найден'));
        }

        let comparePassword = bcrypt.compareSync(password, user.password);
        if(!comparePassword) {
            return next(ApiError.badRequest('Не верный пароль'));

        }
        const token = generateJwt(user.id, user.email, user.role, user.registrationDate);
        return res.json({token});
    }

    async check(req, res, next) {
       const token = generateJwt(req.id, req.email, req.role, req.registrationDate);
       return res.json({token});
    }

    async getAll(req, res, next) {
        const users = await User.findAll();
        return res.json(users)
    }
}

module.exports = new UserController();