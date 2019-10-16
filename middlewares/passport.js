const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const config = require('config');
const userModel = require('../components/user/models');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false
    },
    async (username, password, callback) => {
      return userModel
        .get(username, password)
        .then(user => {
          if (!user) {
            return callback(null, false, { message: 'Incorrect fields' });
          }
          return callback(null, user, { message: 'Logged' });
        })
        .catch(err => {
          callback(err);
        });
    }
  )
);

passport.use(
  new JWTStategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('Auth.passphare')
    },
    async (jwtPayload, callback) => {
      return userModel
        .getByUsername(jwtPayload.username)
        .then(user => {
          return callback(null, user);
        })
        .catch(err => {
          callback(err);
        });
    }
  )
);
