var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
var config = require('../config');

var jwt = require('jwt-simple');

var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
  var oauth2Client = new OAuth2(config.googleClientId, config.googleClientSecret, config.googleRedirectUrl);
  var scopes = [
    'https://www.googleapis.com/auth/plus.me'
  ];

  var url = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: scopes
  });
  res.redirect(url);
});


router.get('/login', function (req, res, next) {
  var oauth2Client = new OAuth2(config.googleClientId, config.googleClientSecret, config.googleRedirectUrl);
  var code = req.query.code;

  oauth2Client.getToken(code, function (err, tokens) {
    if (!err) {
      oauth2Client.setCredentials(tokens);
      plus.people.get({ userId: 'me', auth: oauth2Client }, function (err, response) {
        if (!err) {
          var userInfo = {
            id: response.id,
            name: response.displayName,
            thumbnailUrl: response.image.url
          };
          var token = jwt.encode(userInfo, config.jwtKey);
          res.send({ token: token });
        } else {
          res.send({ error: err });
        }
      });
    } else {
      res.send({ error: err, code: code });
    }
  });
});

router.get('/check', function (req, res, next) {
  res.send(req.user);
});

router.get('/checktoken', function (req, res, next) {
  var token = req.query.token;
  var userInfo = jwt.decode(token, config.jwtKey);
  res.send(userInfo);
});

module.exports = router;


