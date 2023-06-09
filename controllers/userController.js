const ApiError = require('../error/ApiError');
const {User} = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateJwt = function(id, name, email, role, registrationDate) {
    return jwt.sign(
        {id, name, email, role, registrationDate}, 
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
        const token = generateJwt(user.id, user.name, user.email, user.role, user.registrationDate);
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
        if(user.status === 'blocked') {
            return next(ApiError.badRequest('Вы заблокированы'));
        }
        const token = generateJwt(user.id, user.name, user.email, user.role, user.registrationDate);
        return res.json({token});
    }

    async check(req, res, next) {
       const token = generateJwt(req.user.id, req.user.name, req.user.email, req.user.role, req.user.registrationDate);
       return res.json({token});
    }

    async getAll(req, res, next) {
        const users = await User.findAll();
        return res.json(users)
    }

    async getUserId(req, res, next) {
        const user = await User.findByPk(req.params.id);
        if(!user) {
            return next(ApiError.badRequest('пользователь не найден'));
        }
        res.json(user)
    }

    async deleteUserId(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
            return res.status(404).send('User not found');
            }
            await user.destroy();
            res.send('User deleted');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

    async dataUpdateId(req, res) {
        const {  status, role } = req.body;
        try {
            console.log(req.params.id)
            const user = await User.findByPk(req.params.id);
            if (!user) {
                console.log(req.params.id)
                return res.status(404).send('User not found');
            }

            user.status = status;
            user.role = role;
            await user.save();
            res.json(user);
        } catch (error) {
            console.error(error);
            console.log(req.params.id)
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new UserController();