var express = require('express');
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var router = express.Router();

// database connection
mongoose.connect('mongodb://localhost:27017/dicerollgame', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
// error checking
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
  console.log('connected to database on mongodb://localhost:27017/dicerollgame');
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
            newUser.password = undefined;
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
    