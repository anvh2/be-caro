var passport = require('passport');
var jwt = require('jsonwebtoken');
var models = require('./models');
var config = require('config');

module.exports = {
  login: (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          code: 400,
          message: info ? info.message : 'Login failed',
          user: user
        });
      }

      req.login(user, { session: false }, err => {
        if (err) {
          res.json({
            code: -1,
            message: err
          });
        }

        // generate access token
        var passphare = config.get('Auth.passphare');
        const payload = {
          username: user[0].username
        };
        var token = jwt.sign(payload, passphare);
        return res.json({ payload, token });
      });
    })(req, res);
  },
  register: (req, res, next) => {
    var entity = {
      username: req.body.username,
      password: req.body.password,
      display_name: req.body.displayname
    };

    models
      .add(entity)
      .then(id => {
        return res.json({
          code: 1,
          message: 'OK'
        });
      })
      .catch(err => {
        return res.json({
          code: -1,
          message: err
        });
      });
  },
  profile: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        res.json({
          code: -1,
          message: err
        });
      }
      if (info !== undefined) {
        res.json({
          code: -1,
          message: info.message
        });
      } else {
        res.status(200).json({
          code: 1,
          auth: true,
          data: user[0],
          message: 'Valid token'
        });
      }
    })(req, res);
  },
  update: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        res.json({
          code: -1,
          message: err
        });
        if (info != undefined) {
          res.json({
            code: -1,
            message: info.message
          });
        } else {
          console.log(req.user);
          models
            .update(req.user)
            .then(data => {
              console.log(data);
              res.status(200).json({
                code: 1,
                auth: true,
                message: 'Ok'
              });
            })
            .catch(err => {
              console.log(err);
              res.json({
                code: -1,
                auth: false,
                message: 'Not ok'
              });
            });
        }
      }
    });
  }
};
