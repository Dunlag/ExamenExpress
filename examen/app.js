var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//para poder usar bootstrap
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist')))
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Ruta para obtener puntos de interés desde el JSON
app.get('/api/puntos', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'puntos.json'), 'utf8', (err, data) => {
      if (err) {
          res.status(500).json({ error: 'Error al cargar los datos' });
      } else {
          res.json(JSON.parse(data));
      }
  });
});


const peliculasPath = path.join(__dirname, 'data', 'peliculas.json');

// Obtener lista de películas
app.get('/api/peliculas', (req, res) => {
    fs.readFile(peliculasPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al cargar los datos' });
        res.json({ data: JSON.parse(data) });
    });
});

// Añadir película
app.post('/api/peliculas', (req, res) => {
    fs.readFile(peliculasPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer los datos' });

        let peliculas = JSON.parse(data);
        let nuevaPelicula = { id: peliculas.length + 1, ...req.body };
        peliculas.push(nuevaPelicula);

        fs.writeFile(peliculasPath, JSON.stringify(peliculas, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error al guardar la película' });
            res.json({ mensaje: 'Película añadida' });
        });
    });
});

// Eliminar película
app.delete('/api/peliculas/:id', (req, res) => {
    fs.readFile(peliculasPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer los datos' });

        let peliculas = JSON.parse(data);
        let nuevasPeliculas = peliculas.filter(p => p.id != req.params.id);

        fs.writeFile(peliculasPath, JSON.stringify(nuevasPeliculas, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar la película' });
            res.json({ mensaje: 'Película eliminada' });
        });
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
