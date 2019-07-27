const express = require('express');
const cors = require('cors');
const hub = require('hub');

const app = express();

app.use(express.json({ limit: '800mb' }));
app.use(cors());
app.set('port', process.env.API_PORT);

require('./database/init');

const { sequelize: con } = require('./database/sequelize');

hub.connectedUserToken = [];

 app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`);
});

module.exports = { con, app };

app.use(require('./routes/routes'));
