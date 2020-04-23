const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const typed = require('typed.js');
const bcrypt = require('bcrypt');

const port = process.env.PORT || 3000;
const app = express();
const path = require('path');
const profileRouter = require(__dirname, '/routes/profile');
const feedRouter = require(__dirname, '/routes/feed');

const routes = require(__dirname + '/routes/routes.js');

const db = require('./models/db.js');


app.engine( 'hbs', exphbs({
  extname: 'hbs',
  defaultView: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts'),
  partialsDir: path.join(__dirname, '/views/partials'),
}));

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use('/', routes);

db.connect();



app.listen(port, function()
{
    console.log('listening at port ' + port);
});

module.exports = app;
