var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');

var jwt = require('jwt-simple');

var express = require('express');
var router = express.Router();


var googleClientId = "159291580744-j2nep6399vo2dc4nel7g637055oloohn.apps.googleusercontent.com";
var googleClientSecret = "Fyg7HvCN7ECEMcuDZuSHf7GZ";
var googleRedirectUrl = "https://blockracer-api.azurewebsites.net/auth/login";
var jwtSecret = "0QoCBBqmF134BZsJhGXMl3uzf";


router.get('/', function (req, res, next) {
  var oauth2Client = new OAuth2(googleClientId, googleClientSecret, googleRedirectUrl);
  var scopes = [
    'https://www.googleapis.com/auth/plus.me'
  ];

  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes // If you only need one scope you can pass it as string
  });
  res.redirect(url);
});

//Accepts accessToken
router.get('/login', function (req, res, next) {
  var oauth2Client = new OAuth2(googleClientId, googleClientSecret, googleRedirectUrl);
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
          var token = jwt.encode(userInfo, jwtSecret);
          res.send({ token: token });
        } else {
          res.send({error:err});
        }
      });
    } else {
      res.send({ error: err, code: code });
    }
  });
});

router.get('/checktoken', function (req, res, next) {
  var token = req.query.token;
  var userInfo = jwt.decode(token, jwtSecret);
  res.send(userInfo);
});

module.exports = router;


