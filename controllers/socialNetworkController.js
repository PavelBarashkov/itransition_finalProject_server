const {OAuth2Client} = require('google-auth-library');
const {User} = require('../models/models')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError');


const client = new OAuth2Client('115284206815-itf8mprr1ioqj9pltsd2fqoiv5r7dqjs.apps.googleusercontent.com');

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '115284206815-itf8mprr1ioqj9pltsd2fqoiv5r7dqjs.apps.googleusercontent.com',
  });
  const {given_name, email} = ticket.getPayload();
  return {given_name, email};
}

const generateJwt = function(id, name, email, role, registrationDate) {
    return jwt.sign(
        {id, name, email, role, registrationDate}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}


const {Facebook} = require('fb');
const fb = new Facebook({
  appId: '1992083367821148',
  appSecret: 'c2040654cb3eba86468c127b86c797e8',
  version: 'v11.0'
});

class SocialNetworkController {
    
    async loginGoogle(req, res, next) {
        try {
          const {token} = req.body;
          const googleUser = await verify(token);
          const hashPassword = await bcrypt.hash(token, 5);
          let user = await User.findOne({where: {email: googleUser.email}});
          if (!user) {
            user = await User.create({
              name: googleUser.given_name,
              email: googleUser.email,
              password: hashPassword,
              role: 'USER',
              registrationDate: new Date().toLocaleString()
            });
          }
          const tokenJWT = generateJwt(user.id, user.name, user.email, user.role, user.registrationDate)
         
          return res.json({token: tokenJWT});
        } catch (e) {
          console.log(e);
          return next(ApiError.internal('Ошибка аутентификации пользователя через Google'));
        }
    }

    async loginFacebook(req, res, next) {
      try {
        const {accessToken} = req.body;
        const hashPassword = await bcrypt.hash(accessToken, 5);
        fb.setAccessToken(accessToken);
        const fbUser = await fb.api('/me', {fields: ['id', 'name', 'email']});
        let user = await User.findOne({where: {email: fbUser.email}});
        if (!user) {
          user = await User.create({
            name: fbUser.name,
            email: fbUser.email,
            password: hashPassword,
            role: 'USER',
            registrationDate: new Date().toLocaleString()
          });
        }
        const tokenJWT = generateJwt(user.id, user.name, user.email, user.role, user.registrationDate)
       
        return res.json({token: tokenJWT});
      } catch (e) {
        console.log(e);
        return next(ApiError.internal('Ошибка аутентификации пользователя через Facebook'));
      }
    }
}

module.exports = new SocialNetworkController();