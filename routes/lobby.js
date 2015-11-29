var express = require('express');
var router = express.Router();
var DBManager = require('../db-manager');
var lobbyManager = require('../models/lobby-manager');

router.get('/', function (req, res, next) {
  var dbManager = new DBManager('lobby');
  dbManager.query({'status':'open'}).then(function(lobbys){
    res.send(lobbys);
  }).catch(function(error){
    res.status(500).send({error:error});
  });  
});

router.post('/', function (req, res, next) {
  var dbManager = new DBManager('lobby');
  var title = req.body.title;
  
  if(!title){
    res.status(400).send("Title is required!");
    return;
  }    
  
  var newLobby = lobbyManager.create(title);
  
  dbManager.save(newLobby)
  .then(function(doc){
    res.send(doc);
  })
  .catch(function(error){
    res.status(500).send({error:error});
  });;  
});

router.get('/:id', function (req, res, next) {
  var dbManager = new DBManager('lobby');
  var id = req.params.id;
  
  dbManager.query({id:id}).then(function (lobbys) {
    if(lobbys.length !=1){
      res.status(404).send("Cannot find lobby");        
    }
    res.send(lobbys[0]);
  }).catch(function(error){
    res.status(500).send({error:error});  
  });
});


//Inits db
router.get('/init', function (req, res, next) {
  var dbManager = new DBManager('lobby');
  dbManager.init().then(function(response){
    res.send("Ok");
  }).catch(function(error){
    res.status(500).send({error:error});
  });    
});


module.exports = router;
