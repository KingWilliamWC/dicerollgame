var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/login', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

router.get('/signup', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

router.get('/online', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

router.get('/game', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

router.get('/toptable', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

router.get('/vscomputergame', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

router.get('/localmultiplayer', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

router.get('/localmultiplayergame', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

module.exports = router;
    