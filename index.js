const Sequelize = require('sequelize');
const express = require('express');
const app = express();
const config = require('config');


const cors = require('cors');

let hub = require('hub');

app.use(express.json());
app.use(cors());

const con = new Sequelize(config.DB, 'phpmyadmin', 'atlas2010', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

hub.connectedUserToken = []

con.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

app.get('/', function(req, res) {
    res.send('Hello DEMO !')
});

app.listen(process.env.API_PORT, function() {
    console.log('Listening on port ' + process.env.API_PORT);
});

module.exports = {con : con, app: app};

app.use('/plant/:name', require('./routes/plantExist'));
app.use('/plant/add', require('./routes/plantAdd'));
app.use('/plantInfo', require('./routes/plantInfo'));
app.use('/plants/fetch', require('./routes/plantFetch'));
app.use('/plant/request/fetch', require('./routes/fetchRequestNewPlant'));

app.use('/user/authentication', require('./routes/userAuthentication'));
app.use('/user/registration/', require('./routes/registration'));
app.use('/user/updatePassword/', require('./routes/updatePassword'));
app.use('/user/info', require('./routes/userInfo'));
app.use('/user/right', require('./routes/userRight'));
app.use('/userPlants', require('./routes/userPlants'));
app.use('/disconnection', require('./routes/disconnection'));
app.use('/role', require('./routes/role'));
app.use('/user/isAdmin', require('./routes/isAdmin'));
