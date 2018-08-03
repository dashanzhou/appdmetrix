var models  = require('../models');
var express = require('express');
var router  = express.Router();


router.get('/', function(req, res) {
  models.appdmetrix.findAll().then(function(appdmetrix) {
    res.render('appdmetrix', {
      title: `appdmetrix`,
      appdmetrix : appdmetrix
    });
  });
});
module.exports = router;