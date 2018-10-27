const express = require('express');

const app = express();

const cors = require('cors');

const hub = require('hub');

app.use(express.json());
app.use(cors());

require('./database/init');

const { sequelize: con } = require('./database/sequelize');

hub.connectedUserToken = [];

app.listen(process.env.API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${process.env.API_PORT}`);
});

module.exports = { con, app };

app.use(require('./routes/routes'));
