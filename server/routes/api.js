var express = require('express');
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var router = express.Router();

// top table model
const topTableSchema = new mongoose.Schema({
  players: Array,
})

const topTable = mongoose.model('Toptable', topTableSchema);

// database connection
mongoose.connect('mongodb://localhost:27017/dicerollgame', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
// error checking
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
  console.log('connected to database on mongodb://localhost:27017/dicerollgame');
  var isTopTableModel = false;
  mongoose.connection.db.listCollections().toArray(function (err, names) {
    for(var i = 0; i < names.length; i++){
      if(names[i].name === 'toptables'){
        isTopTableModel = true;
      }
    }

    if(!isTopTableModel){
      new topTable({
        players: [] // empty array
      }).save((err, newTopTable) => {
        if(err){
          console.error(err);
          process.exit(1);
        }else{
          console.log("Created new table since we didn't have one");
        }
      })
    }
});
})

//password hashing setup
const saltRounds = 10;

makeid = (length) => {
  var result           = '';
  var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

//random number for profile images
randomIntFromInterval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Create game and return game id for client use
router.post('/newgameid', function(req, res, next) {

  res.json({'success': true, 'newGameID': makeid(6)});
});

// user account routes
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  profileImage: String,
  gameHistory: Array,
});

const User = mongoose.model('User', userSchema);



router.post('/signup', (req, res) => {
  User.find({username: req.body.username}, (err, foundUsernames) => {
    if(foundUsernames.length === 0){
      bcrypt.hash(req.body.password, saltRounds, (err, hashedPassword) => {
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
          profileImage: `/ProfileImages/${randomIntFromInterval(1, 15)}.png`, // random image in case they close before selecting an image
          gameHistory: [],
        }).save((err, newUser) => {
          if(err){res.json({err: 'err'});res.end();}
          else{
            newUser.password = undefined; // don't send the password
            res.json({'success': true, 'user': newUser, 'id': newUser._id});
          }
        })
      })
    }else{
      // user already exists
      res.json({'success': false, 'reason': 'duplicate'});
    }
  })
})

router.post('/login', (req, res) => {
  User.find({username: req.body.username}, (err, foundUsernames) => {
    if(foundUsernames.length === 1){
      // there will only be one user
      var foundUsername = foundUsernames[0];
      bcrypt.compare(req.body.password, foundUsername.password, (err, result) => {
        if(result === true){
          foundUsername.password = undefined; // don't send the password to the client... by all means
          console.log(foundUsername);
          res.json({"success": true, 'user': foundUsername});
        }else{
          res.json({"success": false, "reason": "invpassword"})
        }
      })
    }else{
      res.json({"success": false, "reason": "none"})
    }
  })
})

// getUniqueListBy = (arr, key) => {
//   // this may or may not have been nicked from https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
//   return [...new Map(arr.map(item => [item[key], item])).values()]
// }

checkHighScore = (currentTable, winner) => {
  var newTable = currentTable.players;
  console.log(newTable, newTable.length);
  if(newTable.length === 0){
    // no sorting required, first one in
    var addWinner = {
      'username': winner.username,
      'score': winner.endScore
    }

    // console.log('were adding the first one');

    newTable.push(addWinner);
    var croppedTable = newTable;
  }else{
    var addWinner = {
      'username': winner.username,
      'score': winner.endScore
    }
    newTable.push(addWinner);
    newTable.sort((a, b) => b.score - a.score);


    // remove all the duplicates of there previous scores
    var duplicates = []
    for(var i = 0; i < newTable.length; i++){
      if(newTable[i].username === winner.username){
        duplicates.push(i);
      }
    }
    if(duplicates.length > 1){
      duplicates.shift();
      newTable.splice(duplicates[0], 1);
    }

    if(newTable.length > 5){
      var croppedTable = newTable.slice(0, 5);
    }else{
      var croppedTable = newTable;
    }
    // console.log('new table:', croppedTable);
  }

  topTable.findByIdAndUpdate({_id: currentTable._id}, {players: croppedTable},{new: true}, (err, result) => {
    if(err){console.log('error', err)}
    else{
      console.log("Succesfully updated table: ", result);
    }
  });
}

updateHighScore = (winner) => {
  topTable.find({}, (err, foundTopTables) => {
    if(err){res.json({'err': err, 'success': false})}
    else{
      if(foundTopTables.length === 1){
        console.log();
        checkHighScore(foundTopTables[0], winner);
        return {'success': true};
      }else{
        // res.json({'success': false, 'reason': 'duplicatetables'});
        return {'success': false, 'reason': 'duplicate'};
      }
    }
  })
}

router.post('/gameend', (req, res) => {
  // console.log(req.body);
  updateHighScore(req.body.winner);
  res.json({'success': true});
})

router.get('/toptable', (req, res) => {
  topTable.find({}, (err, foundTopTables) => {
    if(err){res.json({'err': err, 'success': false})}
    else{
      if(foundTopTables.length === 1){
        res.json({'success': true,'topTable': foundTopTables[0]});
      }else{
        res.json({'success': false,'reason': 'duplicate'});
      }
    }
  })
})

router.post('/updateProfileImage', (req, res) => {
  User.findByIdAndUpdate(req.body.id, {profileImage: req.body.newProfileImage}, {new: true} , (err, result) => {
    if(!err){
      result.password = undefined;
      res.json({'success': true, 'user': result});
    }else{
      res.json({'success': false})
    }
  })
})

module.exports = router;