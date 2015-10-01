var mysql = require('mysql');

var connection = mysql.createConnection({
  user: "root",
  password: "",
  database: "fileDealer_db"
});

connection.connect();

module.exports = {

  createGame: function(params, cb) {
      var gameTable = "INSERT into gameTable(game_name, description, created_date) VALUES(?,?,?)";
      // var gameTable = "INSERT into gameTable(game_name) VALUES(?)";
      var today = new Date();
      var createdDate = today.getMonth()  +1 + "/"+ today.getDate() + "/"+ today.getFullYear();
      // connection.query(gameTable, params, function(err, results){
      connection.query(gameTable, [params.gameName, params.description, createdDate], function(err, results){        
        if(err){
          console.error(err);
        }
        else{
          console.log('results ',results);
          gameId = results.insertId
          cb(gameId);
        }
      });
  },
  createNodeInfo: function(params, cb){
    var insertStr = "INSERT into treasureInfo(lon, lat, image, clue, nodeId, gameId) VALUES(?,?,?,?,?,?)";
    var selectStr ="SELECT nodeId FROM treasureInfo WHERE gameId=(?) ORDER BY nodeId DESC limit 1";
    var nodeId = 1;
    console.log('createTreasureInfo params',params);
    connection.query(selectStr, [params.gameId], function(err, results){
      if(err){
        console.error(err);
      }
      else{
        console.log('SELECT results',results)
        if(results[0]){
          nodeId = results[0].nodeId+1;
        }
        console.log('this should be clue ',params.clue);
        connection.query(insertStr, [params.longitude, params.latitude, params.imgKey, params.clue, nodeId, params.gameId],
          function(err, results){
            if(err){
              console.error(err);
            }
            else{
              console.log(results);
            }
          });
      }
    });
  },
  getPlayerContact: function(params,cb) {
    var insertStr = "INSERT into playerContact(gameId, email) VALUES(?,?)";
    connection.query(insertStr, [params.gameId, params.email], function(err, results){
      if(err){
        console.error(err);
      }
      else{
        console.log('playerContact results', results);
      }
    });
  },
  postNodeInfo: function(params, cb){
    var selectStr = "SELECT gameId, nodeId, image, lat, lon, clue FROM TreasureInfo WHERE gameId=(?)";
    connection.query(selectStr, params, function(err, results){
      if(err){
        console.error(err);
      }
      else{
        cb(results);
        console.log('postNodeInfo', results);
      }
    });
  },
  //list all games

  //retrieve the only the first image 
  showGames: function(cb){
    // var queryStr = "select gameTable.gameId, gameTable.game_name, gameTable.description, gameTable.created_date, treasureInfo.image from gameTable, treasureInfo WHERE gameTable.gameId = treasureInfo.gameId AND treasureInfo.nodeId =1";
    // var countStr = "select gameId,count(nodeId) from treasureInfo group by gameId;";
    var queryStr = "select distinct \
        g.game_name, \
        t.gameid, \
        g.description, \
        g.created_date, \
        c.nodecount, \
        i.image \
        from gametable as g \
        join treasureinfo as t \
        on t.gameid = g.gameid \
        join ( \
          select gameid, \
          count(nodeid) as nodecount \
          from treasureinfo group by gameid ) as c \
        on c.gameid = t.gameid \
        join ( \
          select gameid, \
          image, min(nodeid) as nodeid \
          from treasureinfo group by gameid ) as i \
        on i.gameid = t.gameid;"
    connection.query(queryStr, function(err, results){
      if(err){
        console.error(err);
      }
      else{
        console.log(results);
        cb(results);
      }
    }); 
  },
  getGameInfo : function(id, cb){
    var selectStr = "SELECT DISTINCT g.game_name, g.description, g.created_date, t.nodeId, t.lat, t.lon, t.image, t.clue FROM treasureInfo as t JOIN gameTable as g on g.gameId = t.gameId WHERE g.gameId = (?)";
    connection.query(selectStr, id, function(err, results){
      if(err){
        console.error(err);
      }
      console.log(results);
      cb(err, results);
    });
  }
};
// module.exports.showGames(function(game){console.log(game)});


// description, city, length, date created, author
// retrieve: all games, first pic,
// all info: first pic, date created, number of nodes

// gameName
// timelineKey, geolocation{lat:, long}, hint, image

// module.exports = connection;
