const Sequelize = require('sequelize');
const config = require('config');

const sequelize = new Sequelize(config.DB, config.user_db, config.password_db, {
  host: config.host,
  dialect: config.dialect,
  logging: config.logging,
  define: {
    timestamps: false
  }
});

module.exports = {
  sequelize,
  Sequelize
};
