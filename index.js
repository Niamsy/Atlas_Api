const Sequelize      = require('sequelize');
const express        = require('express');
const app            = express();

const cors           = require('cors');

let hub              = require('hub');

app.use(cors());

const con = new Sequelize('Atlas', 'phpmyadmin', 'atlas2010', {
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
});

app.listen(process.env.API_PORT, function() {
    console.log('Listening on port ' + process.env.API_PORT)
});

module.exports = con;

app.use('/plant/:name', require('./routes/plantExist'));
app.use('/plant/add', require('./routes/plantAdd'));
app.use('/plants/fetch', require('./routes/plantFetch'));
app.use('/user/authentication', require('./routes/userAuthentication'));
