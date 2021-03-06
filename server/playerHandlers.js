var utils = require("./utils.js");
var jwt = require('jwt-simple');
var db = require('./db/db.js');

var _secret = 'BiGaCoRn';

module.exports = {

  // user progress will be stored in a cookie
  // if user does not have cookie process them as a new user
  checkPlayerStatus : function(req, res, next){
    console.log("Cookies: " + JSON.stringify(req.cookies));
    // if it is user's first time to site, send back cookie with 
    // gameId and roundNumber to track progress
    // initialize roundNumber to 0 for new users
    // if(!req.cookies.jim){
    //   res.cookie('jim', {cool:'yep, he is cool'})
    // }else{
    //   res.cookie('jim', {cool:"totallyBadass"});
    // }
    
    next();
  },

  macadamia: function(req, res){
    var userName = jwt.decode(req.body.token, _secret);
    var macadamia =req.body.macadamia;
    var nodeId = req.body.nodeId;
    var gameId = req.body.gameId;
    db.macadamia({userName : userName, macadamia : macadamia, gameId : gameId, nodeId : nodeId}, function(results){
      res.send(results);
    });
  },
  // sendResponse : function(req, res){
  //   var gameId = req.params.gameId;
  //   res.send("Accessing game with id: " + utils.encodeGameUrl({ gameId: gameId }));    
  // },
  getLeads: function(req, res){
      if(req.body.token){
        var userName = jwt.decode(req.body.token, _secret);
      }
      db.getLeads({userName:userName}, function(results){
      res.send(results);
    });
  },

  invitePlayers : function(req, res){
    // get array of email addresses from post request data 
    var inviteeEmails = req.body.inviteeEmailAddresses;
    var gameId = req.body.gameId;

    console.log("attempting to send email from playerHandler");
    utils.invitePlayersViaEmail(inviteeEmails, gameId);
    res.end("Invitations sent")
  },

register : function(req, res){
    db.userRegister(req.body, function(results){
      if(results.error){
        res.send(results);
      }else{
        var token = jwt.encode(req.body.userName, _secret);
        results.token = token;
        results.auth = true;
        results.userName = req.body.userName;
        res.send(results);
      }
    });
  },

  signIn : function(req, res){
    db.userSignIn(req.body , function(results){
      if(results.error){
        res.send(results);
      }else{
        var token = jwt.encode(req.body.userName, _secret);
        results.token = token;
        results.auth = true;
        results.userName = req.body.userName;
        res.send(results);
      }
    });
  },


  checkToken : function(req, res){
    var data = {};
    data.userName = jwt.decode(req.body.token, _secret);
    db.checkUserName(data, function(results){
      res.send(results);
    });
  },

  creatorsData: function(req, res){
    db.creatorsData(function(results){
      console.log(results, 'playerHandler creatorsData');
      res.send(results);
    });
  }
};

// module.exports.checkGameCallbacks = [
//     module.exports.checkPlayerStatus
// ]