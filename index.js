const Sequelize = require('sequelize');
const express = require('express');
const app = express();
const config = require('config');

const cors = require('cors');

let hub = require('hub');

app.use(express.json());
app.use(cors());

const con = new Sequelize(config.DB, 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

hub.connectedUserToken = [];

con.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});

app.listen(process.env.API_PORT, () => {
    console.log('Listening on port ' + process.env.API_PORT);
});

module.exports = { con : con, app: app };

app.use(require('./routes/routes'));
