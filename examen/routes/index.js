var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Inicio' });
});


router.get('/mapa', function(req,res,next){
  res.render('mapa', { title: 'Mapa' });
})

router.get('/alertas', function(req,res,next){
  res.render('alertas', { title: 'alertas' });
})

router.get('/tabla', function(req,res,next){
  res.render('tabla', { title: 'tabla' });
})



module.exports = router;
