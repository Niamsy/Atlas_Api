const express = require('express');
const cors = require('cors');
const hub = require('hub');

const app = express();

app.use(express.json({ limit: '800mb' }));
app.use(cors());

require('./database/init');

const { sequelize: con } = require('./database/sequelize');

hub.connectedUserToken = [];

 app.listen(process.env.API_PORT, () => {
  console.log(`Listening on port ${process.env.API_PORT}`);
});

module.exports = { con, app };

app.use(require('./routes/routes'));
