const Sequelize = require('sequelize');
const config = require('config');

const sequelize = new Sequelize(config.DB, 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = {
    sequelize: sequelize,
    Sequelize: Sequelize
};
