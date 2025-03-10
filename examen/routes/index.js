var express = require('express');
var router = express.Router();


//enrutando a mapas
router.get('/', function(req,res,next){
  res.render('mapa', { title: 'Mapa' });
})

module.exports = router;
