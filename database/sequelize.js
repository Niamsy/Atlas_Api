const Sequelize = require('sequelize');
const config = require('config');

const sequelize = new Sequelize(config.DB, config.user_db, config.password_db, {
  host: config.host,
  dialect: config.dialect,
  logging: config.logging
});

module.exports = {
  sequelize,
  Sequelize
};
