const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');


const client = new OAuth2Client(CLIENT_ID);
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '115284206815-itf8mprr1ioqj9pltsd2fqoiv5r7dqjs.apps.googleusercontent.com',
  });
  const {name, email} = ticket.getPayload();
  return {name, email};
}

class SocialNetworkController {
    async loginGoogle(req, res, next) {
        try {
          const {token} = req.body;
          const googleUser = await verify(token);
          let user = await User.findOne({where: {email: googleUser.email}});
          if (!user) {
            user = await User.create({
              name: googleUser.name,
              email: googleUser.email,
              password: Math.random().toString(36).substring(2),
              role: 'USER',
              registrationDate: new Date().toLocaleString()
            });
          }
          const tokenJWT = jwt.sign(
              {id: user.id, email: user.email, role: user.role, registrationDate: user.registrationDate},
              process.env.SECRET_KEY,
              {expiresIn: '24h'}
          );
          return res.json({token: tokenJWT});
        } catch (e) {
          console.log(e);
          return next(ApiError.internal('Ошибка аутентификации пользователя через Google'));
        }
      }

}

module.exports = new SocialNetworkController();