const Sequelize = require('sequelize');
const express = require('express');
const app = express();
const config = require('config');
const plantInfo = require('./routes/PlantInfo/functions_PlantInfo.js');


const cors = require('cors');

let hub = require('hub');

app.use(express.json());
app.use(cors());

const con = new Sequelize(config.DB, 'phpmyadmin', 'atlas2010', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

hub.connectedUserToken = [];

con.authenticate().then(() => {
    console.log('Connection has been established successfully.');

    plantInfo.loadAllCorrespondanceList(con);
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
app.use('/plant/create', require('./routes/createPlant'));
app.use('/plantInfo', require('./routes/plantInfo'));
app.use('/plants/fetch', require('./routes/plantFetch'));
app.use('/plant/request/fetch', require('./routes/fetchRequestNewPlant'));
app.use('/plant/request/create', require('./routes/requestForNewPlant'));
app.use('/plant/request/information', require('./routes/requestPlantInformation'));

app.use('/user/authentication', require('./routes/userAuthentication'));
app.use('/user/registration', require('./routes/registration'));
app.use('/user/updatePassword', require('./routes/updatePassword'));
app.use('/user/info', require('./routes/userInfo'));
app.use('/user/right', require('./routes/userRight'));
app.use('/user/resetPassword', require('./routes/resetPassword'));

app.use('/userPlants', require('./routes/userPlants'));

app.use('/disconnection', require('./routes/disconnection'));
app.use('/role', require('./routes/role'));
app.use('/user/isAdmin', require('./routes/isAdmin'));
app.use('/user/glossary', require('./routes/glossary'));

app.use('/plantInfo/reproduction', require('./routes/PlantInfo/plantReproduction'));
app.use('/plantInfo/soilHumidity', require('./routes/PlantInfo/plantSoilHumidity'));
app.use('/plantInfo/soilType', require('./routes/PlantInfo/plantSoilType'));
app.use('/plantInfo/soilPH', require('./routes/PlantInfo/plantSoilPH'));
app.use('/plantInfo/sunExposure', require('./routes/PlantInfo/plantSunExposure'));