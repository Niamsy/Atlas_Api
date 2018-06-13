const Sequelize      = require('sequelize');
const express        = require('express');
const app            = express();

const cors           = require('cors');
const crypto         = require('crypto');
const SHA256         = require("crypto-js/sha256");

const TokenGenerator = require('uuid-token-generator');
var hub              = require('hub');

const tokgen = new TokenGenerator();

app.use(cors())

const con = new Sequelize('atlas', 'phpmyadmin', 'atlas2010', {
    host: 'localhost',
    dialect: 'mysql',
});

hub.connectedUserToken = []

con.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

app.get('/', function(req, res) {
    res.send('Hello World! Hello DEMO ! Hello test 1!')
})

app.use('/plant/:name', require('./routes/plantExist'));
app.use('/plant/add', require('./routes/plantAdd'));
app.use('/plants/fetch', require('./routes/plantFetch'));
app.use('/user/authentication', require('./routes/userAuthentication'));

app.listen(process.env.API_PORT, function() {
    console.log('Example app listening on port ' + process.env.API_PORT)
});
