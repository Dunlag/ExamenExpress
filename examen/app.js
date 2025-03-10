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


// ruta para cargar datos desde el archivo GeoJSON
app.get('/api/museos', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'museos.geojson'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error al cargar los datos' });
        } else {
            try {
                const geojson = JSON.parse(data);
                res.json(geojson);
            } catch (parseError) {
                res.status(500).json({ error: 'Error con el archivo GeoJSON' });
            }
        }
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
